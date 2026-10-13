import {
  BlockType,
  Content,
  ContentBlock,
  ContentListItem,
  ContentMetadata,
  ContentType,
} from '@/types/content'
import { env } from './env'
import { notion } from './notion'

interface NotionPage {
  id: string
  properties: Record<string, unknown>
}

interface DatabaseQueryResponse {
  results: NotionPage[]
  has_more: boolean
  next_cursor?: string
}

interface BlocksListResponse {
  results: Array<{
    id: string
    type: string
    [key: string]: unknown
  }>
  has_more: boolean
  next_cursor?: string
}

interface NotionBlock {
  id: string
  type: string
  [key: string]: unknown
}

/**
 * Notion 페이지 데이터를 ContentMetadata로 변환
 */
function extractMetadata(notionPage: NotionPage): ContentMetadata {
  const properties = notionPage.properties || {}

  // 썸네일 추출 (rich_text로 저장됨)
  const thumbnail = extractText(properties.썸네일) || undefined

  // 공개 여부 추출 (checkbox 타입)
  let isPublished = false
  const publishedProp = properties.공개
  if (publishedProp && typeof publishedProp === 'object') {
    const pub = publishedProp as Record<string, unknown>
    if (pub.type === 'checkbox' && pub.checkbox === true) {
      isPublished = true
    }
  }

  return {
    title: extractText(properties.제목),
    type: (extractText(properties.select) || 'book') as ContentType,
    genre: extractText(properties.장르),
    creator: extractText(properties['작가/감독']),
    rating: parseFloat(extractText(properties.평점) || '0'),
    tags: extractTags(properties.태그),
    thumbnail,
    publishedAt: undefined,
    isPublished,
  }
}

/**
 * Notion 텍스트 필드 추출 (첫 번째 항목만)
 */
function extractText(field: unknown): string {
  if (!field || typeof field !== 'object') return ''

  const f = field as Record<string, unknown>
  switch (f.type) {
    case 'title': {
      if (
        Array.isArray(f.title) &&
        f.title[0] &&
        typeof f.title[0] === 'object' &&
        'plain_text' in f.title[0]
      ) {
        return String(f.title[0].plain_text)
      }
      return ''
    }
    case 'rich_text': {
      if (
        Array.isArray(f.rich_text) &&
        f.rich_text[0] &&
        typeof f.rich_text[0] === 'object' &&
        'plain_text' in f.rich_text[0]
      ) {
        return String(f.rich_text[0].plain_text)
      }
      return ''
    }
    case 'select': {
      if (f.select && typeof f.select === 'object' && 'name' in f.select) {
        return String(f.select.name)
      }
      return ''
    }
    case 'number': {
      return String(f.number || '')
    }

    case 'multi_select': {
      if (Array.isArray(f.multi_select)) {
        return f.multi_select
          .map(item =>
            item && typeof item === 'object' && 'name' in item
              ? String(item.name)
              : ''
          )
          .filter(Boolean)
          .join(', ')
      }
      return ''
    }
    default:
      return ''
  }
}

/**
 * Notion rich_text 필드의 모든 텍스트를 결합해서 추출
 */
function extractRichText(field: unknown): string {
  if (!field || typeof field !== 'object') return ''

  const f = field as Record<string, unknown>
  if (f.type === 'rich_text' && Array.isArray(f.rich_text)) {
    return f.rich_text
      .map(item =>
        item && typeof item === 'object' && 'plain_text' in item
          ? String(item.plain_text)
          : ''
      )
      .join('')
  }
  return ''
}
/**
 * Notion 태그/멀티셀렉트 추출
 */
function extractTags(field: unknown): string[] {
  if (!field || typeof field !== 'object') return []
  const f = field as Record<string, unknown>
  if (f.type !== 'multi_select') return []
  return (Array.isArray(f.multi_select) ? f.multi_select : []).map(tag =>
    tag && typeof tag === 'object' && 'name' in tag ? String(tag.name) : ''
  )
}

/**
 * Notion 블록을 ContentBlock으로 변환
 */
function convertNotionBlockToContentBlock(
  notionBlock: NotionBlock
): ContentBlock | null {
  const blockType = notionBlock.type

  let content = ''
  let type: BlockType = 'paragraph'
  let level: number | undefined

  const getContent = (block: unknown) => {
    if (block && typeof block === 'object' && 'rich_text' in block) {
      const richText = block.rich_text
      if (Array.isArray(richText)) {
        // 모든 rich_text 항목을 결합
        return richText
          .map(item =>
            item && typeof item === 'object' && 'plain_text' in item
              ? String(item.plain_text)
              : ''
          )
          .join('')
      }
    }
    return ''
  }

  switch (blockType) {
    case 'paragraph':
      content = getContent(notionBlock.paragraph)
      type = 'paragraph'
      break
    case 'heading_1':
      content = getContent(notionBlock.heading_1)
      type = 'heading_1'
      level = 1
      break
    case 'heading_2':
      content = getContent(notionBlock.heading_2)
      type = 'heading_2'
      level = 2
      break
    case 'bulleted_list_item':
      content = getContent(notionBlock.bulleted_list_item)
      type = 'bulleted_list_item'
      break
    case 'numbered_list_item':
      content = getContent(notionBlock.numbered_list_item)
      type = 'numbered_list_item'
      break
    default:
      return null
  }

  if (!content) return null

  return {
    id: String(notionBlock.id),
    type,
    content,
    ...(level !== undefined && { level }),
  }
}

/**
 * Notion API 데이터베이스 쿼리 헬퍼
 */
async function queryDatabase(
  filter?: Record<string, unknown>,
  sorts?: Record<string, unknown>[],
  pageSize?: number
): Promise<DatabaseQueryResponse> {
  const requestBody = {
    filter,
    sorts,
    page_size: pageSize,
  }

  // 데이터베이스 ID 형식 검증
  const dbId = env.NOTION_DATABASE_ID
  const dbIdLength = dbId.length
  const hasHyphens = dbId.includes('-')

  const url = `https://api.notion.com/v1/databases/${dbId}/query`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    let errorMessage = `Notion API error: ${response.status} ${response.statusText}`

    try {
      const errorBody = (await response.json()) as Record<string, unknown>
      if (errorBody.code && errorBody.message) {
        errorMessage = `Notion API error [${errorBody.code}]: ${errorBody.message}`
      }
    } catch {
      // 응답 파싱 실패 시 기본 메시지 사용
    }

    console.error('Notion API request failed:', {
      status: response.status,
      url,
      dbIdLength,
      hasHyphens,
      requestBody: JSON.stringify(requestBody),
      errorMessage,
    })

    throw new Error(errorMessage)
  }

  return response.json() as Promise<DatabaseQueryResponse>
}

/**
 * 데이터베이스에서 공개 콘텐츠 목록 조회
 * Notion API를 사용하여 실제 데이터를 조회
 */
export async function getPublicContents(): Promise<ContentListItem[]> {
  try {
    const response = await queryDatabase({
      property: '공개',
      checkbox: {
        equals: true,
      },
    })

    return response.results.map((page: NotionPage) => {
      const metadata = extractMetadata(page)
      return {
        id: page.id,
        title: metadata.title,
        type: metadata.type,
        creator: metadata.creator,
        rating: metadata.rating,
        thumbnail: metadata.thumbnail,
        isPublished: metadata.isPublished,
      }
    })
  } catch (error) {
    console.error('Failed to fetch public contents:', error)
    throw error
  }
}

/**
 * 타입별 콘텐츠 목록 조회
 * Notion API를 사용하여 필터링된 데이터를 조회
 */
export async function getContentsByType(
  type: ContentType
): Promise<ContentListItem[]> {
  try {
    const response = await queryDatabase({
      and: [
        {
          property: '공개',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'select',
          select: {
            equals: {
              book: '책',
              movie: '영화',
              drama: '드라마',
            }[type],
          },
        },
      ],
    })

    return response.results.map((page: NotionPage) => {
      const metadata = extractMetadata(page)
      return {
        id: page.id,
        title: metadata.title,
        type: metadata.type,
        creator: metadata.creator,
        rating: metadata.rating,
        thumbnail: metadata.thumbnail,
        isPublished: metadata.isPublished,
      }
    })
  } catch (error) {
    console.error(`Failed to fetch contents by type ${type}:`, error)
    throw error
  }
}

/**
 * 상위 평점 콘텐츠 조회 (추천용)
 * Notion API를 사용하여 평점 기준 정렬된 데이터를 조회
 */
export async function getTopRatedContents(
  limit: number = 6
): Promise<ContentListItem[]> {
  try {
    const response = await queryDatabase(
      {
        property: '공개',
        checkbox: {
          equals: true,
        },
      },
      [
        {
          property: '평점',
          direction: 'descending',
        },
      ],
      limit
    )

    return response.results.map((page: NotionPage) => {
      const metadata = extractMetadata(page)
      return {
        id: page.id,
        title: metadata.title,
        type: metadata.type,
        creator: metadata.creator,
        rating: metadata.rating,
        thumbnail: metadata.thumbnail,
        isPublished: metadata.isPublished,
      }
    })
  } catch (error) {
    console.error('Failed to fetch top rated contents:', error)
    throw error
  }
}

/**
 * Notion 페이지 블록 조회 헬퍼 (페이지네이션 포함)
 */
async function getPageBlocks(pageId: string): Promise<BlocksListResponse> {
  const allBlocks: Array<{
    id: string
    type: string
    [key: string]: unknown
  }> = []
  let cursor: string | undefined
  let hasMore = true

  while (hasMore) {
    const url = new URL(`https://api.notion.com/v1/blocks/${pageId}/children`)
    if (cursor) {
      url.searchParams.set('start_cursor', cursor)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Notion API error: ${response.status} ${response.statusText}`
      )
    }

    const data = (await response.json()) as BlocksListResponse
    allBlocks.push(...data.results)
    hasMore = data.has_more
    cursor = data.next_cursor
  }

  return {
    results: allBlocks,
    has_more: false,
  }
}

/**
 * 콘텐츠 상세 조회 (ID 기반)
 * Notion API를 사용하여 페이지 정보와 블록 내용을 조회
 */
export async function getContentById(pageId: string): Promise<Content | null> {
  try {
    const page = await notion.pages.retrieve({
      page_id: pageId,
    })

    const pageData = page as unknown as NotionPage & {
      created_time: string
      last_edited_time: string
    }

    const metadata = extractMetadata(pageData)

    let blocks: ContentBlock[] = []

    // 1. 먼저 페이지의 하위 블록을 시도
    const blocksResponse = await getPageBlocks(pageId)
    blocks = blocksResponse.results
      .map(block => convertNotionBlockToContentBlock(block as NotionBlock))
      .filter((block): block is ContentBlock => block !== null)

    // 2. 블록이 없으면 '내용' 프로퍼티에서 추출
    if (blocks.length === 0) {
      const properties = pageData.properties || {}
      const contentProp = properties['내용']

      if (contentProp && typeof contentProp === 'object') {
        const contentText = extractRichText(contentProp)
        if (contentText) {
          // '내용' 프로퍼티를 하나의 paragraph 블록으로 변환
          blocks = [
            {
              id: `content-property-${pageId}`,
              type: 'paragraph',
              content: contentText,
            },
          ]
        }
      }
    }

    return {
      id: pageId,
      notionPageId: pageId,
      metadata,
      blocks,
      createdAt: pageData.created_time,
      updatedAt: pageData.last_edited_time,
    }
  } catch (error) {
    console.error(`Failed to fetch content with ID ${pageId}:`, error)
    throw error
  }
}

/**
 * 필터링된 콘텐츠 목록 조회 (타입 + 검색)
 * Notion API를 사용하여 조건에 맞는 데이터를 조회
 */
export async function getFilteredContents(
  type?: ContentType,
  searchQuery?: string
): Promise<ContentListItem[]> {
  try {
    const filters: Record<string, unknown>[] = [
      {
        property: '공개',
        checkbox: {
          equals: true,
        },
      },
    ]

    if (type) {
      const notionType = {
        book: '책',
        movie: '영화',
        drama: '드라마',
      }[type]

      filters.push({
        property: 'select',
        select: {
          equals: notionType,
        },
      })
    }

    const filter =
      filters.length === 1
        ? filters[0]
        : {
            and: filters,
          }

    const response = await queryDatabase(filter)

    let results = response.results.map((page: NotionPage) => {
      const metadata = extractMetadata(page)
      return {
        id: page.id,
        title: metadata.title,
        type: metadata.type,
        creator: metadata.creator,
        rating: metadata.rating,
        thumbnail: metadata.thumbnail,
        isPublished: metadata.isPublished,
      }
    })

    if (searchQuery) {
      results = results.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.creator.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return results
  } catch (error) {
    console.error('Failed to fetch filtered contents:', error)
    throw error
  }
}
