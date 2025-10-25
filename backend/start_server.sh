#!/bin/bash

# 백엔드 서버 실행 스크립트

echo "🚀 News Processing Backend 서버를 시작합니다..."

# Python 가상환경 확인
if [ ! -d "venv" ]; then
    echo "📦 Python 가상환경을 생성합니다..."
    python3 -m venv venv
fi

# 가상환경 활성화
echo "🔧 가상환경을 활성화합니다..."
source venv/bin/activate

# 의존성 설치
echo "📚 필요한 패키지를 설치합니다..."
pip install -r requirements.txt

# Playwright 브라우저 설치
echo "🌐 Playwright 브라우저를 설치합니다..."
playwright install chromium

# 환경변수 파일 생성 (예시)
if [ ! -f ".env" ]; then
    echo "⚙️ 환경변수 파일을 생성합니다..."
    cat > .env << EOF
# OpenAI API 키 (번역 + 요약 모두 사용)
OPENAI_API_KEY=your_openai_api_key_here

# 선택사항 (더 좋은 번역 품질을 원한다면)
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
DEEPL_API_KEY=your_deepl_api_key_here

# 선택사항 (더 좋은 요약 품질을 원한다면)
CLAUDE_API_KEY=your_claude_api_key_here
EOF
    echo "📝 .env 파일이 생성되었습니다. OpenAI API 키만 설정하면 됩니다!"
fi

# 서버 실행
echo "🎯 서버를 실행합니다..."
python app.py