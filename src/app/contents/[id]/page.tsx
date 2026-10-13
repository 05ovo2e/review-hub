'use client'

import { NotionBlocksList } from '@/components/content/NotionBlockRenderer'
import { fetchContentById } from '@/lib/server/actions'
import { Content } from '@/types/content'
import { ChevronLeft, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'

interface ContentDetailPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * 콘텐츠 상세 페이지
 * 메타정보와 Notion에서 가져온 리뷰 본문을 표시
 */
export default function ContentDetailPage({ params }: ContentDetailPageProps) {
  const { id } = use(params)
  const [content, setContent] = useState<Content | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchContentById(id)
        if (!data) {
          setError('콘텐츠를 찾을 수 없습니다.')
          setContent(null)
        } else {
          setContent(data)
        }
      } catch (err) {
        console.error('콘텐츠 로드 실패:', err)
        setError('콘텐츠 로드 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="text-slate-600 dark:text-slate-400">로딩 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <Link
            href="/contents"
            className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ChevronLeft size={20} />
            뒤로 가기
          </Link>
          <div className="flex justify-center py-12">
            <div className="text-red-600 dark:text-red-400">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  const metadata = content.metadata
  const typeLabel = {
    book: '📕 책',
    movie: '🎬 영화',
    drama: '🎭 드라마',
  }[metadata.type]

  return (
    <div className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
      <div className="container mx-auto max-w-3xl px-4">
        {/* 뒤로 가기 */}
        <Link
          href="/contents"
          className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ChevronLeft size={20} />
          뒤로 가기
        </Link>

        {/* 썸네일 */}
        {metadata.thumbnail && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg sm:h-96">
            <Image
              src={metadata.thumbnail}
              alt={metadata.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* 메타정보 */}
        <div className="mb-8">
          {/* 타입 배지 */}
          <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-100">
            {typeLabel}
          </div>

          {/* 제목 */}
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
            {metadata.title}
          </h1>

          {/* 작가/감독 */}
          <p className="mb-4 text-lg text-slate-600 dark:text-slate-400">
            {metadata.type === 'book' ? '저자' : '감독'}: {metadata.creator}
          </p>

          {/* 평점 */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={
                    i < Math.floor(metadata.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }
                />
              ))}
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {metadata.rating.toFixed(1)}
            </span>
          </div>

          {/* 장르 및 태그 */}
          <div className="mb-6 space-y-3">
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                장르:{' '}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {metadata.genre}
              </span>
            </div>
            {metadata.tags.length > 0 && (
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  태그:{' '}
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {metadata.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <hr className="my-8 border-slate-300 dark:border-slate-700" />

        {/* 리뷰 본문 */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            리뷰
          </h2>
          {content.blocks.length > 0 ? (
            <NotionBlocksList blocks={content.blocks} />
          ) : (
            <p className="text-slate-600 dark:text-slate-400">
              리뷰 내용이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
