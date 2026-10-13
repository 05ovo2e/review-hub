'use client'

import { Button } from '@/components/ui/button'
import { ContentType } from '@/types/content'

interface ContentFilterProps {
  selectedType?: ContentType | null
  onTypeChange: (type: ContentType | null) => void
}

/**
 * 콘텐츠 필터 컴포넌트
 * 콘텐츠 유형별 필터링 (책/영화/드라마)
 */
export function ContentFilter({
  selectedType,
  onTypeChange,
}: ContentFilterProps) {
  const filters: Array<{ value: ContentType; label: string; icon: string }> = [
    { value: 'book', label: '책', icon: '📕' },
    { value: 'movie', label: '영화', icon: '🎬' },
    { value: 'drama', label: '드라마', icon: '🎭' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {/* 전체 필터 */}
      <Button
        variant={selectedType === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTypeChange(null)}
        className="rounded-full"
      >
        전체
      </Button>

      {/* 타입별 필터 */}
      {filters.map(filter => (
        <Button
          key={filter.value}
          variant={selectedType === filter.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange(filter.value)}
          className="rounded-full"
        >
          <span className="mr-1">{filter.icon}</span>
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
