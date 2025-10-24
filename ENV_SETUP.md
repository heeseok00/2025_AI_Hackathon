# 환경 변수 설정 가이드

프로젝트를 실행하기 전에 `.env` 파일을 생성하고 API 키를 설정해야 합니다.

## .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# News API (https://newsapi.org/)
VITE_NEWS_API_KEY=your_newsapi_key_here

# OpenAI API (https://platform.openai.com/)
VITE_OPENAI_API_KEY=your_openai_key_here

# Google Translate API (optional)
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_key_here

# Papago API (optional)
VITE_PAPAGO_CLIENT_ID=your_papago_client_id_here
VITE_PAPAGO_CLIENT_SECRET=your_papago_client_secret_here
```

## API 키 발급 방법

### 1. News API
- 웹사이트: https://newsapi.org/
- 무료 플랜: 100 requests/day
- 회원가입 후 API 키 발급

### 2. OpenAI API
- 웹사이트: https://platform.openai.com/
- GPT-4o 모델 사용 가능
- 유료 (사용량에 따라 과금)

### 3. Google Translate API (선택사항)
- 웹사이트: https://cloud.google.com/translate
- 무료 할당량: 월 500,000 characters

### 4. Papago API (선택사항)
- 웹사이트: https://developers.naver.com/products/papago/
- 무료: 일 10,000 characters

## 주의사항

⚠️ `.env` 파일은 절대 Git에 커밋하지 마세요!
`.gitignore`에 이미 추가되어 있습니다.
