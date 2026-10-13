import { ContentBlock } from '@/types/content'

interface NotionBlockRendererProps {
  block: ContentBlock
}

/**
 * Notion 블록을 HTML로 렌더링하는 컴포넌트
 * 지원 블록 타입: paragraph, heading_1, heading_2, bulleted_list_item, numbered_list_item
 */
export function NotionBlockRenderer({ block }: NotionBlockRendererProps) {
  switch (block.type) {
    case 'heading_1':
      return (
        <h1 className="mt-8 mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {block.content}
        </h1>
      )

    case 'heading_2':
      return (
        <h2 className="mt-6 mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {block.content}
        </h2>
      )

    case 'paragraph':
      return (
        <p className="mb-4 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
          {block.content}
        </p>
      )

    case 'bulleted_list_item':
      return (
        <ul className="mb-4 ml-4 list-disc space-y-2 text-slate-700 dark:text-slate-300">
          <li>{block.content}</li>
        </ul>
      )

    case 'numbered_list_item':
      return (
        <ol className="mb-4 ml-4 list-decimal space-y-2 text-slate-700 dark:text-slate-300">
          <li>{block.content}</li>
        </ol>
      )

    default:
      return null
  }
}

interface NotionBlocksListProps {
  blocks: ContentBlock[]
}

/**
 * 여러 Notion 블록을 렌더링
 */
export function NotionBlocksList({ blocks }: NotionBlocksListProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {blocks.map(block => (
        <NotionBlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}
