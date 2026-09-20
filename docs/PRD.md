# Review Hub 제품 요구사항 정의서 (PRD)

Notion을 CMS로 활용한 책, 영화, 드라마 콘텐츠 리뷰 서비스를 구현합니다.

## 프로젝트 개요

### 프로젝트명

**Review Hub** - Notion 기반 콘텐츠 리뷰 플랫폼

### 목적

Notion에서 콘텐츠와 리뷰를 관리하고, Next.js 웹사이트에서 공개된 콘텐츠를 조회할 수 있는 간단한 리뷰 서비스를 구현합니다.

## 주요 기능

### 1. 콘텐츠 목록

공개된 콘텐츠를 카드 형태로 표시합니다.

### 2. 콘텐츠 유형 필터링

다음 유형으로 콘텐츠를 필터링합니다.

- 책
- 영화
- 드라마

### 3. 콘텐츠 상세

콘텐츠의 기본 정보와 Notion 페이지에 작성된 리뷰 본문을 표시합니다.

### 4. 추천 콘텐츠

홈 화면에서 평점이 높은 공개 콘텐츠를 최대 6개 표시합니다.

## 화면 구성

### 홈 (`/`)

- 평점이 높은 콘텐츠 최대 6개 표시
- 콘텐츠 카드 클릭 시 상세 페이지 이동

### 콘텐츠 목록 (`/contents`)

- 공개 콘텐츠 카드 목록
- 콘텐츠 유형 필터
- 썸네일, 제목, 작가/감독, 평점 표시

### 콘텐츠 상세 (`/contents/[id]`)

- 제목
- 콘텐츠 유형
- 장르
- 작가/감독
- 평점
- 태그
- 썸네일
- Notion 페이지 리뷰 본문

## 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | Next.js 15.5.3 |
| Language | TypeScript 5 |
| CMS | Notion API (`@notionhq/client`) |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui |
| Icons | lucide-react |

## Notion 데이터베이스 구조

| 속성명 | 타입 | 설명 |
|---|---|---|
| 제목 | Title | 콘텐츠 제목 |
| 콘텐츠 유형 | Select | 책, 영화, 드라마 |
| 장르 | Multi-select | 콘텐츠 장르 |
| 작가/감독 | Rich text | 작가 또는 감독 |
| 평점 | Number | 1~5 평점 |
| 태그 | Multi-select | 콘텐츠 태그 |
| 썸네일 | Files & media | 대표 이미지 |
| 공개 여부 | Checkbox | 웹사이트 공개 여부 |

리뷰 본문은 데이터베이스 속성이 아니라 각 Notion 페이지의 본문에 작성합니다.

Notion API의 `blocks.children.list`로 본문을 조회하여 웹사이트에 표시합니다.

MVP에서는 다음 블록 타입을 지원합니다.

- paragraph
- heading
- bulleted list
- numbered list

## 환경 변수

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`

실제 값은 `.env.local`에 저장하고 `.env.example`에는 플레이스홀더를 작성합니다.

Notion API 관련 환경 변수는 서버에서만 사용합니다.

## MVP 구현 범위

- Notion API 연결
- Notion 콘텐츠 조회
- 공개 콘텐츠만 조회
- 콘텐츠 목록
- 콘텐츠 유형 필터
- 콘텐츠 상세 페이지
- Notion 리뷰 본문 조회 및 표시
- 홈 화면 추천 콘텐츠
- 기본 반응형 UI

## 구현 순서

### 1. Notion 연결

- [ ] `@notionhq/client` 설치
- [ ] 환경 변수 설정
- [ ] Notion API 클라이언트 생성

### 2. Notion 데이터 준비

- [ ] 콘텐츠 데이터베이스 생성
- [ ] 8개 속성 설정
- [ ] Integration 연결
- [ ] 책, 영화, 드라마 샘플 데이터 등록
- [ ] 각 페이지에 리뷰 작성

### 3. 웹사이트 구현

- [ ] `/` 홈 화면
- [ ] `/contents` 목록
- [ ] 콘텐츠 유형 필터
- [ ] `/contents/[id]` 상세 페이지
- [ ] Notion 리뷰 본문 표시

### 4. 확인

- [ ] 공개 콘텐츠만 표시되는지 확인
- [ ] 유형 필터 동작 확인
- [ ] 상세 페이지 동작 확인
- [ ] 실제 Notion 데이터로 전체 흐름 확인
- [ ] lint / typecheck / build 통과

## 향후 개선 사항

MVP 이후 필요에 따라 다음 기능을 추가합니다.

- 장르 / 평점 / 태그 필터
- 검색
- 페이지네이션
- 사용자 로그인 및 북마크
- 사용자 댓글
- 개인화 추천
- SEO / OG 이미지
- Notion Webhook

## MVP 완료 기준

다음 흐름이 정상적으로 동작하면 MVP 완료입니다.

`Notion에서 콘텐츠 작성 → Notion API → 콘텐츠 목록 → 유형 필터 → 상세 페이지 → Notion 리뷰 표시`