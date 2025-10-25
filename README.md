# 🌍 GlobaLink - 글로벌 뉴스 플랫폼

NewsAPI를 활용한 글로벌 뉴스 수집 및 Playwright 기반 원문 분석 시스템

## ✨ 주요 기능

- **글로벌 뉴스 수집**: 미국, 독일, 인도, 일본의 핫이슈 뉴스
- **원문 분석**: Playwright로 뉴스 기사 원문 추출
- **다국어 지원**: 원문, 번역본, 요약본 제공
- **실시간 처리**: 사용자 요청 시 즉시 분석

## 🏗️ 시스템 아키텍처

```
Frontend (React) → Backend (Flask) → NewsAPI → Playwright → 번역/요약 API
```

## 🚀 설치 및 실행

### 1. 프론트엔드 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 2. 백엔드 실행
```bash
# 백엔드 디렉토리로 이동
cd backend

# 서버 실행 스크립트 실행
./start_server.sh
```

### 3. API 키 설정 (선택사항)
`backend/.env` 파일에서 다음 API 키들을 설정하세요:

```env
# 번역 API
GOOGLE_TRANSLATE_API_KEY=your_key_here
DEEPL_API_KEY=your_key_here

# 요약 API
OPENAI_API_KEY=your_key_here
CLAUDE_API_KEY=your_key_here
```

## 📁 프로젝트 구조

```
hackaton/
├── src/                    # React 프론트엔드
│   ├── components/         # React 컴포넌트
│   ├── api/               # API 호출 함수
│   └── pages/             # 페이지 컴포넌트
├── backend/               # Python 백엔드
│   ├── scraper.py         # Playwright 스크래핑
│   ├── processor.py       # 번역/요약 처리
│   ├── app.py            # Flask API 서버
│   └── requirements.txt   # Python 의존성
└── README.md
```

## 🔧 사용법

### 1. 뉴스 보기
- 지도에서 국가 선택 (미국, 독일, 인도, 일본)
- 해당 국가의 핫이슈 뉴스 확인

### 2. 기사 분석
- 관심 있는 기사에서 "📰 기사 분석하기" 버튼 클릭
- 원문/번역본/요약본 탭으로 전환하여 내용 확인

### 3. 원문 보기
- "원문 보기" 링크로 원본 뉴스 사이트 이동

## 🌐 지원 국가

| 국가 | 코드 | 뉴스 소스 | 언어 |
|------|------|-----------|------|
| 미국 | US | NewsAPI Top Headlines | 영어 |
| 독일 | DE | Everything + Popularity | 독일어/영어 |
| 인도 | IN | Everything + Popularity | 영어/힌디어 |
| 일본 | JP | Everything + Popularity | 일본어/영어 |

## 🔌 API 엔드포인트

### 백엔드 API (포트 5000)

- `POST /api/process` - 전체 기사 처리 (스크래핑 + 번역 + 요약)
- `POST /api/scrape` - 기사 스크래핑만
- `POST /api/translate` - 텍스트 번역
- `POST /api/summarize` - 텍스트 요약
- `GET /api/health` - 서버 상태 확인

### 사용 예시
```javascript
// 기사 전체 처리
const result = await fetch('http://localhost:5000/api/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com/news' })
});
```

## ⚠️ 주의사항

### 법적 고려사항
- 이 프로젝트는 **교육/연구 목적**으로 제작되었습니다
- 상업적 이용 시 **저작권법** 준수 필요
- 뉴스 사이트의 **이용약관** 확인 필요

### 기술적 제한사항
- Playwright는 **브라우저 엔진**을 사용하여 리소스 사용량이 높습니다
- 일부 뉴스 사이트는 **Anti-bot 시스템**으로 차단할 수 있습니다
- API 키 없이는 **시뮬레이션 모드**로 동작합니다

## 🛠️ 개발 정보

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Python + Flask + Playwright
- **News API**: NewsAPI.org
- **번역**: Google Translate API / DeepL API
- **요약**: OpenAI GPT / Claude API

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었으며, 상업적 이용 시 관련 법규를 준수해야 합니다.

---

**2025 AI Hackathon Project** 🚀