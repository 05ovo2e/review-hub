'use server'

import {
  getPublicContents,
  getContentsByType,
  getTopRatedContents,
  getContentById,
  getFilteredContents,
} from './notion-api'
import { ContentType } from '@/types/content'

/**
 * 공개 콘텐츠 조회 (Server Action)
 */
export async function fetchPublicContents() {
  try {
    return await getPublicContents()
  } catch (error) {
    console.error('Failed to fetch public contents:', error)
    throw error
  }
}

/**
 * 타입별 콘텐츠 조회 (Server Action)
 */
export async function fetchContentsByType(type: ContentType) {
  try {
    return await getContentsByType(type)
  } catch (error) {
    console.error(`Failed to fetch contents by type ${type}:`, error)
    throw error
  }
}

/**
 * 상위 평점 콘텐츠 조회 (Server Action)
 */
export async function fetchTopRatedContents(limit: number = 6) {
  try {
    return await getTopRatedContents(limit)
  } catch (error) {
    console.error('Failed to fetch top rated contents:', error)
    throw error
  }
}

/**
 * 콘텐츠 상세 조회 (Server Action)
 */
export async function fetchContentById(pageId: string) {
  try {
    return await getContentById(pageId)
  } catch (error) {
    console.error(`Failed to fetch content with ID ${pageId}:`, error)
    throw error
  }
}

/**
 * 필터링된 콘텐츠 조회 (Server Action)
 */
export async function fetchFilteredContents(
  type?: ContentType,
  searchQuery?: string
) {
  try {
    return await getFilteredContents(type, searchQuery)
  } catch (error) {
    console.error('Failed to fetch filtered contents:', error)
    throw error
  }
}
