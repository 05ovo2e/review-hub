import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Container size="md">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground text-lg">
            찾을 수 없는 페이지입니다.
          </p>
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
