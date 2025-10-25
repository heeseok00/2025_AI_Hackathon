import requests
import json
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

class TranslationService:
    def __init__(self):
        # 환경변수 다시 로드
        load_dotenv()
        
        # Google Translate API 키 (환경변수에서 가져오기)
        self.google_api_key = os.getenv('GOOGLE_TRANSLATE_API_KEY')
        self.google_translate_url = 'https://translation.googleapis.com/language/translate/v2'
        
        # DeepL API 키 (대안)
        self.deepl_api_key = os.getenv('DEEPL_API_KEY')
        self.deepl_url = 'https://api-free.deepl.com/v2/translate'
        
        # OpenAI API 키 (GPT 번역용)
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.openai_url = 'https://api.openai.com/v1/chat/completions'
        
        print(f"TranslationService 초기화 - OpenAI API 키: {'설정됨' if self.openai_api_key else '미설정'}")

    def translate_text(self, text: str, target_lang: str = 'ko', source_lang: str = 'auto') -> Optional[str]:
        """텍스트 번역 (GPT 사용)"""
        if not text or len(text.strip()) < 10:
            return None
            
        # 텍스트가 너무 길면 청크 단위로 나누어 번역
        if len(text) > 6000:
            return self._translate_long_text(text, target_lang)
        
        print(f"번역 시도: {len(text)}자 텍스트")
        
        # GPT로 번역
        if self.openai_api_key:
            try:
                result = self._translate_with_gpt(text, target_lang)
                if result:
                    print("GPT 번역 성공")
                    return result
                else:
                    print("GPT 번역 결과가 비어있음")
            except Exception as e:
                print(f"GPT 번역 실패: {e}")
        
        # API 키가 없으면 간단한 번역 시뮬레이션
        print("GPT 번역 실패, 시뮬레이션 사용")
        return self._simulate_translation(text)

    def _translate_with_deepl(self, text: str, target_lang: str, source_lang: str) -> Optional[str]:
        """DeepL API 사용"""
        try:
            headers = {
                'Authorization': f'DeepL-Auth-Key {self.deepl_api_key}',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            
            data = {
                'text': text,
                'target_lang': target_lang.upper(),
                'source_lang': source_lang.upper() if source_lang != 'auto' else None
            }
            
            response = requests.post(self.deepl_url, headers=headers, data=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return result['translations'][0]['text']
            else:
                print(f"DeepL API 오류: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"DeepL 번역 오류: {e}")
            return None

    def _translate_with_google(self, text: str, target_lang: str, source_lang: str) -> Optional[str]:
        """Google Translate API 사용"""
        try:
            params = {
                'key': self.google_api_key,
                'q': text,
                'target': target_lang,
                'source': source_lang if source_lang != 'auto' else None
            }
            
            response = requests.post(self.google_translate_url, params=params, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return result['data']['translations'][0]['translatedText']
            else:
                print(f"Google Translate API 오류: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"Google 번역 오류: {e}")
            return None

    def _translate_with_gpt(self, text: str, target_lang: str) -> Optional[str]:
        """GPT로 번역"""
        try:
            print(f"GPT 번역 API 호출 - API 키 길이: {len(self.openai_api_key) if self.openai_api_key else 'None'}")
            
            headers = {
                'Authorization': f'Bearer {self.openai_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': '다음 영어 텍스트를 한국어로 번역해주세요. 중요한 점:\n1. 원문의 모든 내용을 빠뜨리지 말고 그대로 번역하세요\n2. 요약하지 말고 전체 내용을 번역하세요\n3. 자연스럽고 정확한 한국어로 번역하세요\n4. 문장 구조와 의미를 그대로 유지하세요'
                    },
                    {
                        'role': 'user',
                        'content': text
                    }
                ],
                'max_tokens': 4000,
                'temperature': 0.1
            }
            
            response = requests.post(self.openai_url, headers=headers, json=data, timeout=60)
            
            print(f"GPT 번역 응답 상태: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content'].strip()
            else:
                print(f"GPT 번역 API 오류: {response.status_code}")
                print(f"오류 응답: {response.text[:200]}")
                return None
                
        except Exception as e:
            print(f"GPT 번역 오류: {e}")
            return None

    def _simulate_translation(self, text: str) -> str:
        """번역 시뮬레이션 (API 키가 없을 때)"""
        # 간단한 번역 시뮬레이션
        sentences = text.split('.')
        if len(sentences) > 1:
            first_sentence = sentences[0].strip()
            return f"[번역 시뮬레이션] {first_sentence}... (번역 API 키가 필요합니다. 원문을 확인해주세요.)"
        return f"[번역 시뮬레이션] {text[:100]}... (번역 API 키가 필요합니다. 원문을 확인해주세요.)"

    def _translate_long_text(self, text: str, target_lang: str) -> str:
        """긴 텍스트를 청크 단위로 나누어 번역"""
        print(f"긴 텍스트 번역 시작: {len(text)}자")
        
        # 문장 단위로 나누기
        sentences = text.split('. ')
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            if len(current_chunk + sentence) > 5000:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence
            else:
                current_chunk += sentence + ". "
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        print(f"텍스트를 {len(chunks)}개 청크로 분할")
        
        # 각 청크를 번역
        translated_chunks = []
        for i, chunk in enumerate(chunks):
            print(f"청크 {i+1}/{len(chunks)} 번역 중...")
            try:
                translated_chunk = self._translate_with_gpt(chunk, target_lang)
                if translated_chunk:
                    translated_chunks.append(translated_chunk)
                else:
                    translated_chunks.append(f"[청크 {i+1} 번역 실패]")
            except Exception as e:
                print(f"청크 {i+1} 번역 오류: {e}")
                translated_chunks.append(f"[청크 {i+1} 번역 실패]")
        
        # 번역된 청크들을 합치기
        result = " ".join(translated_chunks)
        print(f"긴 텍스트 번역 완료: {len(result)}자")
        return result

class SummarizationService:
    def __init__(self):
        # 환경변수 다시 로드
        load_dotenv()
        
        # OpenAI API 키
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.openai_url = 'https://api.openai.com/v1/chat/completions'
        
        # Claude API 키 (대안)
        self.claude_api_key = os.getenv('CLAUDE_API_KEY')
        self.claude_url = 'https://api.anthropic.com/v1/messages'
        
        print(f"SummarizationService 초기화 - OpenAI API 키: {'설정됨' if self.openai_api_key else '미설정'}")

    def summarize_text(self, text: str, max_length: int = 300) -> Optional[str]:
        """텍스트 요약 (GPT 사용)"""
        if not text or len(text.strip()) < 50:
            return None
            
        # 텍스트가 너무 길면 잘라서 요약
        if len(text) > 4000:
            text = text[:4000] + "..."
        
        print(f"요약 시도: {len(text)}자 텍스트")
        
        # GPT로 요약
        if self.openai_api_key:
            try:
                result = self._summarize_with_openai(text, max_length)
                if result:
                    print("GPT 요약 성공")
                    return result
                else:
                    print("GPT 요약 결과가 비어있음")
            except Exception as e:
                print(f"GPT 요약 실패: {e}")
        
        # API 키가 없으면 간단한 요약 시뮬레이션
        print("GPT 요약 실패, 시뮬레이션 사용")
        return self._simulate_summarization(text)

    def _summarize_with_openai(self, text: str, max_length: int) -> Optional[str]:
        """OpenAI API 사용"""
        try:
            print(f"GPT 요약 API 호출 - API 키 길이: {len(self.openai_api_key) if self.openai_api_key else 'None'}")
            
            headers = {
                'Authorization': f'Bearer {self.openai_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': f'다음 뉴스 기사를 {max_length}자 이내로 한국어로 요약해주세요. 핵심 내용만 간결하게 정리해주세요.'
                    },
                    {
                        'role': 'user',
                        'content': text
                    }
                ],
                'max_tokens': max_length,
                'temperature': 0.3
            }
            
            response = requests.post(self.openai_url, headers=headers, json=data, timeout=60)
            
            print(f"GPT 요약 응답 상태: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content'].strip()
            else:
                print(f"OpenAI API 오류: {response.status_code}")
                print(f"오류 응답: {response.text[:200]}")
                return None
                
        except Exception as e:
            print(f"OpenAI 요약 오류: {e}")
            return None

    def _summarize_with_claude(self, text: str, max_length: int) -> Optional[str]:
        """Claude API 사용"""
        try:
            headers = {
                'x-api-key': self.claude_api_key,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            }
            
            data = {
                'model': 'claude-3-haiku-20240307',
                'max_tokens': max_length,
                'messages': [
                    {
                        'role': 'user',
                        'content': f'다음 뉴스 기사를 {max_length}자 이내로 한국어로 요약해주세요:\n\n{text}'
                    }
                ]
            }
            
            response = requests.post(self.claude_url, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return result['content'][0]['text'].strip()
            else:
                print(f"Claude API 오류: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"Claude 요약 오류: {e}")
            return None

    def _simulate_summarization(self, text: str) -> str:
        """요약 시뮬레이션 (API 키가 없을 때)"""
        # 간단한 첫 문장 추출
        sentences = text.split('.')
        if len(sentences) > 1:
            first_sentence = sentences[0].strip()
            return f"[요약 시뮬레이션] {first_sentence}... (요약 API 키가 필요합니다. 원문을 확인해주세요.)"
        return f"[요약 시뮬레이션] {text[:100]}... (요약 API 키가 필요합니다. 원문을 확인해주세요.)"

# 통합 서비스 클래스
class NewsProcessingService:
    def __init__(self):
        self.translator = TranslationService()
        self.summarizer = SummarizationService()

    def process_article(self, url: str) -> Dict[str, Any]:
        """기사 전체 처리 (스크래핑 + 번역 + 요약)"""
        try:
            from scraper import NewsScraper
            
            scraper = NewsScraper()
            
            # 1. 스크래핑 (25% 완료)
            print("1단계: 기사 스크래핑 시작...")
            scraped_data = scraper.scrape_article(url)
            
            if not scraped_data['success']:
                return {
                    'success': False,
                    'error': scraped_data['error'],
                    'url': url,
                    'progress': 25,
                    'current_step': '스크래핑 실패'
                }
            
            print("1단계: 기사 스크래핑 완료 (25%)")
            
            # 2. 번역 (50% 완료)
            translated_content = None
            translated_title = None
            try:
                print("2단계: 기사 번역 시작...")
                print(f"스크래핑된 내용 번역 시작: {len(scraped_data['content'])}자")
                translated_content = self.translator.translate_text(scraped_data['content'])
                translated_title = self.translator.translate_text(scraped_data['title'])
                print(f"번역 완료 - 제목: {len(translated_title) if translated_title else 0}자, 내용: {len(translated_content) if translated_content else 0}자")
                print("2단계: 기사 번역 완료 (50%)")
            except Exception as e:
                print(f"번역 오류: {e}")
                translated_content = "[번역 실패]"
                translated_title = "[번역 실패]"
            
            # 3. 요약 (75% 완료)
            summarized_content = None
            try:
                print("3단계: 기사 요약 시작...")
                if translated_content and translated_content != "[번역 실패]":
                    print(f"번역된 내용 요약 시작: {len(translated_content)}자")
                    summarized_content = self.summarizer.summarize_text(translated_content)
                else:
                    # 번역이 실패한 경우 원문을 요약
                    print(f"원문 요약 시작: {len(scraped_data['content'])}자")
                    summarized_content = self.summarizer.summarize_text(scraped_data['content'])
                print(f"요약 완료: {len(summarized_content) if summarized_content else 0}자")
                print("3단계: 기사 요약 완료 (75%)")
            except Exception as e:
                print(f"요약 오류: {e}")
                summarized_content = "[요약 실패]"
            
            # 4. 완료 (100%)
            print("4단계: 모든 처리 완료 (100%)")
            
            return {
                'success': True,
                'original': {
                    'title': scraped_data['title'],
                    'content': scraped_data['content'],
                    'url': url,
                    'metadata': scraped_data['metadata']
                },
                'translated': {
                    'title': translated_title,
                    'content': translated_content
                },
                'summarized': {
                    'content': summarized_content
                },
                'progress': 100,
                'current_step': '완료'
            }
            
        except Exception as e:
            print(f"전체 처리 오류: {e}")
            return {
                'success': False,
                'error': f"기사 처리 중 오류가 발생했습니다: {str(e)}",
                'url': url,
                'progress': 0,
                'current_step': '오류 발생'
            }

# 사용 예시
if __name__ == "__main__":
    service = NewsProcessingService()
    
    test_url = "https://www.bbc.com/news/world-europe-67823456"
    result = service.process_article(test_url)
    
    if result['success']:
        print("처리 성공!")
        print(f"원문 제목: {result['original']['title']}")
        print(f"번역 제목: {result['translated']['title']}")
        print(f"요약: {result['summarized']['content']}")
    else:
        print(f"처리 실패: {result['error']}")