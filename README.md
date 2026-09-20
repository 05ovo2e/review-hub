# Review Hub

Notion을 CMS로 활용한 책, 영화, 드라마 등 콘텐츠 리뷰 서비스입니다.

## 프로젝트 소개

**Review Hub**는 쉽게 콘텐츠를 관리할 수 있도록 Notion을 CMS로 활용합니다. Notion 데이터베이스에 콘텐츠를 등록하면 자동으로 웹사이트에 반영됩니다.

### 주요 기능

- **콘텐츠 목록**: 공개된 콘텐츠를 카드 형태로 표시
- **콘텐츠 필터링**: 유형(책/영화/드라마)별로 콘텐츠 필터링
- **상세 페이지**: 콘텐츠 메타정보와 Notion 페이지에 작성된 리뷰 본문 표시
- **추천 콘텐츠**: 홈 화면에서 평점이 높은 콘텐츠 노출

## 기술 스택

- **Framework**: Next.js 15.5.3 (App Router)
- **Runtime**: React 19.1.0 + TypeScript 5
- **CMS**: Notion API (`@notionhq/client`)
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york style)
- **Icons**: Lucide React
- **Quality**: ESLint + Prettier + Husky + lint-staged

## 시작하기

### 사전 요구사항

- Node.js 18+ 
- npm / yarn / pnpm / bun
- Notion 계정 및 Integration API Key

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음을 추가합니다:

```
NOTION_API_KEY=your-notion-api-key
NOTION_DATABASE_ID=your-database-id
```

자세한 설정 방법은 [docs/PRD.md](./docs/PRD.md#-환경-변수)를 참고하세요.

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 애플리케이션을 확인할 수 있습니다.

## 프로젝트 구조

```
review-hub/
├── app/                 # Next.js App Router
├── components/          # React 컴포넌트
├── lib/                 # 유틸리티 및 API 로직
├── public/              # 정적 파일
├── docs/                # 개발 문서
│   ├── PRD.md          # 제품 요구사항 정의서
│   └── guides/         # 개발 가이드
└── package.json
```

## 개발 가이드

자세한 개발 규칙과 가이드는 다음 문서를 참고하세요:

- [docs/PRD.md](./docs/PRD.md) - 프로젝트 요구사항 정의서 및 구현 단계
- [docs/guides/](./docs/guides/) - 프로젝트 구조, 스타일링, 컴포넌트 패턴

## 커맨드

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start

# 린트 검사
npm run lint

# 모든 검사 실행 (lint + typecheck + build)
npm run check-all
```

## 구현 상태

- [ ] Phase 1: Notion API 패키지 설치 및 환경 설정
- [ ] Phase 2: Notion 콘텐츠 데이터베이스 생성 및 설정
- [ ] Phase 3: 콘텐츠 목록 페이지 및 필터 구현
- [ ] Phase 4: 콘텐츠 상세 페이지 및 리뷰 본문 구현
- [ ] Phase 5: 추천 콘텐츠 영역, 스타일링 및 최적화

자세한 내용은 [docs/PRD.md](./docs/PRD.md#-구현-단계)를 참고하세요.

## 라이선스

MIT
