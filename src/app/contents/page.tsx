'use client'

import { ContentCard } from '@/components/content/ContentCard'
import { ContentFilter } from '@/components/content/ContentFilter'
import { fetchContentsByType, fetchPublicContents } from '@/lib/server/actions'
import { ContentListItem, ContentType } from '@/types/content'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * 콘텐츠 목록 페이지
 * 공개된 콘텐츠를 카드 형태로 표시하고 타입별로 필터링
 */
export default function ContentsPage() {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null)
  const [contents, setContents] = useState<ContentListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContents = async () => {
      setIsLoading(true)
      try {
        let items: ContentListItem[]
        if (selectedType) {
          items = await fetchContentsByType(selectedType)
        } else {
          items = await fetchPublicContents()
        }
        setContents(items)
      } catch (error) {
        console.error('콘텐츠 로드 실패:', error)
        setContents([])
      } finally {
        setIsLoading(false)
      }
    }

    loadContents()
  }, [selectedType])

  const handleTypeChange = (type: ContentType | null) => {
    setSelectedType(type)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
            review hub
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            책, 영화, 드라마의 리뷰를 둘러보세요
          </p>
        </div>

        {/* 필터 */}
        <div className="mb-12">
          <ContentFilter
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
          />
        </div>

        {/* 콘텐츠 목록 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-slate-600 dark:text-slate-400">로딩 중...</div>
          </div>
        ) : contents.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="text-slate-600 dark:text-slate-400">
              {selectedType
                ? '해당 유형의 콘텐츠가 없습니다.'
                : '콘텐츠가 없습니다.'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {contents.map(content => (
              <Link
                key={content.id}
                href={`/contents/${content.id}`}
                className="transition-transform hover:scale-105"
              >
                <ContentCard content={content} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
