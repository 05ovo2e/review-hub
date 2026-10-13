import { Client } from '@notionhq/client'
import { env } from './env'

/**
 * Notion API 클라이언트 인스턴스
 * NOTION_API_KEY 환경변수를 사용하여 초기화됨
 */
export const notion = new Client({
  auth: env.NOTION_API_KEY,
})

export { env as notionEnv }
