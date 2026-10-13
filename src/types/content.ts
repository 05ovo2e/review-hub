/**
 * 콘텐츠 관련 타입 정의
 */

export type ContentType = 'book' | 'movie' | 'drama'

export interface ContentMetadata {
  title: string
  type: ContentType
  genre: string
  creator: string // 작가 또는 감독
  rating: number // 0 ~ 5
  tags: string[]
  thumbnail?: string
  publishedAt?: string
  isPublished: boolean
}

export type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'bulleted_list_item'
  | 'numbered_list_item'

export interface ContentBlock {
  id: string
  type: BlockType
  content: string
  level?: number // heading 레벨
}

export interface Content {
  id: string
  notionPageId: string
  metadata: ContentMetadata
  blocks: ContentBlock[]
  createdAt: string
  updatedAt: string
}

export interface ContentListItem {
  id: string
  title: string
  type: ContentType
  creator: string
  rating: number
  thumbnail?: string
  isPublished: boolean
}
