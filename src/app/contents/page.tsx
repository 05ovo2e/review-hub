'use client'

import { ContentCard } from '@/components/content/ContentCard'
import { ContentFilter } from '@/components/content/ContentFilter'
import { Input } from '@/components/ui/input'
import { fetchContentsByType, fetchPublicContents } from '@/lib/server/actions'
import { ContentListItem, ContentType } from '@/types/content'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * 콘텐츠 목록 페이지
 * 공개된 콘텐츠를 카드 형태로 표시하고 타입별로 필터링, 제목/작가·감독으로 검색
 */
export default function ContentsPage() {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [contents, setContents] = useState<ContentListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 검색어는 대소문자를 구분하지 않고 제목과 작가·감독에서 비교
  const keyword = searchQuery.trim().toLowerCase()
  const filteredContents = keyword
    ? contents.filter(
        content =>
          content.title.toLowerCase().includes(keyword) ||
          content.creator.toLowerCase().includes(keyword)
      )
    : contents

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
        <div className="mb-12 flex flex-col gap-4">
          <ContentFilter
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="제목 또는 작가·감독으로 검색"
            aria-label="콘텐츠 검색"
            className="max-w-md bg-white dark:bg-slate-900"
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
        ) : filteredContents.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="text-slate-600 dark:text-slate-400">
              검색 결과가 없습니다.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredContents.map(content => (
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
