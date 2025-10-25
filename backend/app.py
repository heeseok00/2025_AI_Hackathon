from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
from processor import NewsProcessingService
from sentiment_analyzer import get_sentiment_analyzer
from chatbot import get_chatbot
import traceback

# 환경변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)  # CORS 허용

# 서비스 초기화
news_service = NewsProcessingService()
sentiment_analyzer = get_sentiment_analyzer()
chatbot = get_chatbot()

@app.route('/api/scrape', methods=['POST'])
def scrape_article():
    """기사 스크래핑 API"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({
                'success': False,
                'error': 'URL이 필요합니다'
            }), 400
        
        # 기사 처리
        result = news_service.process_article(url)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"스크래핑 오류: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': f'서버 오류: {str(e)}'
        }), 500

@app.route('/api/translate', methods=['POST'])
def translate_text():
    """텍스트 번역 API"""
    try:
        data = request.get_json()
        text = data.get('text')
        target_lang = data.get('target_lang', 'ko')
        
        if not text:
            return jsonify({
                'success': False,
                'error': '번역할 텍스트가 필요합니다'
            }), 400
        
        translated = news_service.translator.translate_text(text, target_lang)
        
        if translated:
            return jsonify({
                'success': True,
                'original': text,
                'translated': translated
            })
        else:
            return jsonify({
                'success': False,
                'error': '번역에 실패했습니다'
            }), 500
            
    except Exception as e:
        print(f"번역 오류: {e}")
        return jsonify({
            'success': False,
            'error': f'서버 오류: {str(e)}'
        }), 500

@app.route('/api/summarize', methods=['POST'])
def summarize_text():
    """텍스트 요약 API"""
    try:
        data = request.get_json()
        text = data.get('text')
        max_length = data.get('max_length', 300)
        
        if not text:
            return jsonify({
                'success': False,
                'error': '요약할 텍스트가 필요합니다'
            }), 400
        
        summarized = news_service.summarizer.summarize_text(text, max_length)
        
        if summarized:
            return jsonify({
                'success': True,
                'original': text,
                'summarized': summarized
            })
        else:
            return jsonify({
                'success': False,
                'error': '요약에 실패했습니다'
            }), 500
            
    except Exception as e:
        print(f"요약 오류: {e}")
        return jsonify({
            'success': False,
            'error': f'서버 오류: {str(e)}'
        }), 500

@app.route('/api/process', methods=['POST'])
def process_full_article():
    """전체 기사 처리 API (스크래핑 + 번역 + 요약)"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({
                'success': False,
                'error': 'URL이 필요합니다'
            }), 400
        
        # 전체 처리
        result = news_service.process_article(url)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"전체 처리 오류: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': f'서버 오류: {str(e)}'
        }), 500

@app.route('/api/sentiment', methods=['POST'])
def analyze_sentiment():
    """뉴스 감성 분석 API (호재/악재 판단)"""
    try:
        data = request.get_json()
        title = data.get('title', '')
        description = data.get('description', '')
        
        if not title:
            return jsonify({
                'success': False,
                'error': '제목이 필요합니다'
            }), 400
        
        # 감성 분석 수행
        result = sentiment_analyzer.analyze_news(title, description)
        
        if result:
            return jsonify({
                'success': True,
                'sentiment': result
            })
        else:
            return jsonify({
                'success': False,
                'error': '감성 분석에 실패했습니다'
            }), 500
            
    except Exception as e:
        print(f"감성 분석 오류: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': f'서버 오류: {str(e)}'
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """AI 챗봇 API"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        conversation_history = data.get('history', [])
        
        if not message or len(message.strip()) == 0:
            return jsonify({
                'success': False,
                'error': '메시지를 입력해주세요'
            }), 400
        
        # 챗봇 응답 생성
        result = chatbot.chat(message, conversation_history)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify({
                'success': False,
                'error': '챗봇 응답 생성에 실패했습니다'
            }), 500
            
    except Exception as e:
        print(f"챗봇 API 오류: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': f'서버 오류: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """서버 상태 확인"""
    return jsonify({
        'status': 'healthy',
        'message': 'News Processing API is running'
    })

@app.route('/', methods=['GET'])
def index():
    """API 문서"""
    return jsonify({
        'message': 'News Processing API',
        'endpoints': {
            'POST /api/scrape': '기사 스크래핑',
            'POST /api/translate': '텍스트 번역',
            'POST /api/summarize': '텍스트 요약',
            'POST /api/process': '전체 기사 처리',
            'POST /api/sentiment': '뉴스 감성 분석 (호재/악재)',
            'POST /api/chat': 'AI 챗봇 대화',
            'GET /api/health': '서버 상태 확인'
        },
        'example': {
            'url': 'https://example.com/news-article',
            'method': 'POST',
            'endpoint': '/api/process'
        }
    })

if __name__ == '__main__':
    # 환경변수 확인
    print("환경변수 확인:")
    print(f"Google Translate API Key: {'설정됨' if os.getenv('GOOGLE_TRANSLATE_API_KEY') else '미설정'}")
    print(f"DeepL API Key: {'설정됨' if os.getenv('DEEPL_API_KEY') else '미설정'}")
    print(f"OpenAI API Key: {'설정됨' if os.getenv('OPENAI_API_KEY') else '미설정'}")
    print(f"Claude API Key: {'설정됨' if os.getenv('CLAUDE_API_KEY') else '미설정'}")
    
    # 서버 실행
    app.run(debug=True, host='0.0.0.0', port=5000)