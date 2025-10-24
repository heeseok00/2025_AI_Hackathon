# JuSeek

> 전 세계 뉴스 트렌드를 한눈에 확인하는 글로벌 뉴스 탐색 서비스

## 프로젝트 소개

JuSeek는 전 세계 주요 국가들의 실시간 뉴스와 트렌드를 시각화하여 보여주는 React 기반 웹 애플리케이션입니다.

## 주요 컴포넌트

### API
- **newsAPI**: 뉴스 데이터를 가져오는 API 헬퍼
- **translateAPI**: 뉴스 번역을 위한 API 헬퍼

### UI 컴포넌트
- **NewsCard**: 뉴스 정보를 카드 형태로 표시
- **CountrySelector**: 국가 선택 인터페이스
- **TrendMap**: 트렌드를 지도에 시각화

### 페이지
- **Home**: 메인 페이지

## 기술 스택

- React
- Vite
- JavaScript/JSX

## 시작하기

이 저장소는 현재 기본 구조만 포함하고 있습니다. React 앱으로 실행하려면 Vite로 초기화하세요:

```bash
npm create vite@latest . -- --template react
npm install
npm run dev
```

그 후 기존 `src/` 파일들을 필요에 따라 통합하세요.
