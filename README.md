# 🌍 GlobaLink - 글로벌 뉴스 플랫폼

NewsAPI를 활용한 글로벌 뉴스 수집 및 Playwright 기반 원문 분석 시스템

## ✨ 주요 기능

- **글로벌 뉴스 수집**: 미국, 독일, 인도, 일본의 핫이슈 뉴스
- **원문 분석**: Playwright로 뉴스 기사 원문 추출
- **다국어 지원**: 원문, 번역본, 요약본 제공
- **AI 감성 분석**: FinBERT 모델을 활용한 호재/악재 자동 판단
- **AI 챗봇**: OpenAI GPT 기반 대화형 도우미 (우측 하단)
- **실시간 처리**: 사용자 요청 시 즉시 분석

## 🏗️ 시스템 아키텍처

```
Frontend (React) → Backend (Flask) → NewsAPI → Playwright → 번역/요약 API
                                    ↓
                              FinBERT (감성 분석)
                                    ↓
                              GPT Chatbot (대화형 AI)
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

# Python 가상환경 활성화
source venv/bin/activate  # macOS/Linux
# 또는
venv\Scripts\activate     # Windows

# 의존성 설치 (처음 실행시)
pip install -r requirements.txt

# 서버 실행
python app.py
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

### 4. AI 챗봇 사용
- 우측 하단의 💬 버튼 클릭
- 뉴스, 사용법, 기능 등 무엇이든 질문
- 실시간으로 AI가 답변

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
- `POST /api/sentiment` - 뉴스 감성 분석 (호재/악재 판단)
- `POST /api/chat` - AI 챗봇 대화
- `GET /api/health` - 서버 상태 확인

### 사용 예시
```javascript
// 기사 전체 처리
const result = await fetch('http://localhost:5000/api/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com/news' })
});

// 뉴스 감성 분석 (호재/악재)
const sentiment = await fetch('http://localhost:5000/api/sentiment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    title: 'Stock market hits record high',
    description: 'Major tech companies report strong earnings...'
  })
});
// 응답: { label: 'positive', korean_label: '호재', confidence: 0.95 }

// AI 챗봇 대화
const chat = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: '이 사이트 사용법 알려줘',
    history: [] // 이전 대화 기록 (선택사항)
  })
});
// 응답: { success: true, reply: '안녕하세요! 사용법은...' }
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
- **감성 분석**: FinBERT (ProsusAI/finbert) - Hugging Face Transformers
- **AI 챗봇**: OpenAI GPT-3.5-turbo

### 🤖 AI 챗봇

우측 하단에 플로팅 챗봇이 항상 대기하고 있습니다!

**기능:**
- 24/7 실시간 질문 응답
- 사이트 사용법 안내
- 뉴스, 번역, 국가 정보 제공
- 자연스러운 대화 (이모지 포함)
- 대화 히스토리 자동 저장

**사용법:**
1. 우측 하단의 💬 버튼 클릭
2. 궁금한 것을 자유롭게 질문
3. 빠른 질문 버튼으로 쉽게 시작

**예시 질문:**
- "사이트 사용법 알려줘"
- "뉴스는 어떻게 보나요?"
- "호재/악재는 뭔가요?"
- "지원하는 국가가 몇 개예요?"

### 📊 FinBERT 감성 분석

이 프로젝트는 [FinBERT](https://huggingface.co/ProsusAI/finbert) 모델을 사용하여 금융 뉴스의 감성을 분석합니다.

**특징:**
- 금융 도메인에 특화된 BERT 모델
- 3가지 감성 분류: 호재(positive), 악재(negative), 중립(neutral)
- 뉴스 제목과 요약을 기반으로 자동 분석
- 신뢰도(confidence) 점수 제공

**표시 방식:**
- 📈 **호재**: 긍정적인 금융 뉴스 (초록색 배지)
- 📉 **악재**: 부정적인 금융 뉴스 (빨간색 배지)
- ➖ **중립**: 중립적인 뉴스 (회색 배지)

**참고 문헌:**
- Paper: [FinBERT: Financial Sentiment Analysis with Pre-trained Language Models](https://arxiv.org/abs/1908.10063)
- Model: [ProsusAI/finbert](https://huggingface.co/ProsusAI/finbert)

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었으며, 상업적 이용 시 관련 법규를 준수해야 합니다.

---

**2025 AI Hackathon Project** 🚀