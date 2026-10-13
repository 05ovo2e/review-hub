import Image from 'next/image'
import { Star } from 'lucide-react'
import { ContentListItem } from '@/types/content'

interface ContentCardProps {
  content: ContentListItem
  onClick?: () => void
}

/**
 * 콘텐츠 카드 컴포넌트
 * 콘텐츠의 기본 정보(제목, 타입, 작가/감독, 평점, 썸네일)를 표시
 */
export function ContentCard({ content, onClick }: ContentCardProps) {
  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      book: '📕 책',
      movie: '🎬 영화',
      drama: '🎭 드라마',
    }
    return labels[content.type] || content.type
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-slate-900"
    >
      {/* 썸네일 */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700">
        {content.thumbnail ? (
          <Image
            src={content.thumbnail}
            alt={content.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl opacity-20">
            {content.type === 'book' && '📕'}
            {content.type === 'movie' && '🎬'}
            {content.type === 'drama' && '🎭'}
          </div>
        )}
      </div>

      {/* 정보 섹션 */}
      <div className="p-4">
        {/* 타입 배지 */}
        <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-100">
          {getTypeLabel()}
        </div>

        {/* 제목 */}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {content.title}
        </h3>

        {/* 작가/감독 */}
        <p className="mb-3 truncate text-xs text-slate-600 dark:text-slate-400">
          {content.creator}
        </p>

        {/* 평점 */}
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(content.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                }
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-slate-600 dark:text-slate-400">
            {content.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
