"""
AI 챗봇 서비스
OpenAI GPT를 사용한 대화형 챗봇
"""

import requests
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class ChatbotService:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.openai_url = 'https://api.openai.com/v1/chat/completions'
        self.model = 'gpt-3.5-turbo'
        
        print(f"ChatbotService 초기화 - OpenAI API 키: {'설정됨' if self.openai_api_key else '미설정'}")
    
    def chat(self, message: str, conversation_history: List[Dict] = None) -> Optional[Dict]:
        """
        사용자 메시지에 대한 챗봇 응답 생성
        
        Args:
            message: 사용자 메시지
            conversation_history: 이전 대화 기록 [{"role": "user/assistant", "content": "..."}]
        
        Returns:
            {"reply": "챗봇 응답", "success": True}
        """
        if not self.openai_api_key:
            # API 키가 없으면 시뮬레이션 응답
            return self._simulate_response(message)
        
        try:
            # 시스템 메시지 (챗봇 성격 정의)
            system_message = {
                "role": "system",
                "content": """당신은 GlobaLink 글로벌 뉴스 플랫폼의 친절하고 귀여운 AI 도우미입니다.

역할:
- 사용자의 질문에 친절하고 상세하게 답변하기
- 글로벌 뉴스, 국가 정보, 번역, 언어에 대한 질문에 특히 잘 대답하기
- 이모지를 적절히 사용하여 친근하게 대화하기
- 한국어로 답변하기 (사용자가 다른 언어를 요청하면 그 언어로 답변)

특징:
- 밝고 긍정적인 톤
- 전문적이면서도 친근한 말투
- 간단명료한 설명
- 필요시 예시 제공

제한사항:
- 유해하거나 부적절한 내용은 정중히 거절
- 확실하지 않은 정보는 추측하지 않기
- 개인정보는 절대 요청하지 않기"""
            }
            
            # 대화 히스토리 구성
            messages = [system_message]
            
            if conversation_history:
                messages.extend(conversation_history)
            
            # 현재 사용자 메시지 추가
            messages.append({
                "role": "user",
                "content": message
            })
            
            # OpenAI API 호출
            headers = {
                'Authorization': f'Bearer {self.openai_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': self.model,
                'messages': messages,
                'max_tokens': 500,
                'temperature': 0.7,
                'top_p': 0.9,
                'frequency_penalty': 0.5,
                'presence_penalty': 0.3
            }
            
            response = requests.post(
                self.openai_url,
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                reply = result['choices'][0]['message']['content'].strip()
                
                return {
                    'success': True,
                    'reply': reply
                }
            else:
                print(f"OpenAI API 오류: {response.status_code}")
                print(f"응답: {response.text[:200]}")
                return self._simulate_response(message)
        
        except Exception as e:
            print(f"챗봇 오류: {e}")
            return self._simulate_response(message)
    
    def _simulate_response(self, message: str) -> Dict:
        """API 키가 없을 때 시뮬레이션 응답"""
        message_lower = message.lower()
        
        # 간단한 키워드 기반 응답
        if '안녕' in message_lower or 'hello' in message_lower or 'hi' in message_lower:
            reply = "안녕하세요! 👋 GlobaLink 챗봇입니다. 무엇을 도와드릴까요?"
        
        elif '뉴스' in message_lower or 'news' in message_lower:
            reply = "📰 GlobaLink에서는 미국, 독일, 인도, 일본의 최신 뉴스를 실시간으로 제공하고 있어요! 지도에서 국가를 선택하거나 드롭다운에서 검색해보세요."
        
        elif '번역' in message_lower or 'translate' in message_lower or 'translation' in message_lower:
            reply = "🌐 저희 플랫폼은 자동으로 뉴스를 한국어로 번역해드려요! 기사 카드를 클릭하면 원문, 번역본, 요약본을 모두 볼 수 있답니다."
        
        elif '국가' in message_lower or 'country' in message_lower or 'countries' in message_lower:
            reply = "🗺️ 현재 210개 이상의 국가를 지원하고 있어요! 지도 위의 드롭다운 메뉴에서 원하는 국가를 검색하거나, 지도를 직접 클릭해보세요."
        
        elif '감사' in message_lower or 'thank' in message_lower or '고마' in message_lower:
            reply = "천만에요! 😊 더 궁금한 점이 있으면 언제든지 물어보세요!"
        
        elif '도움' in message_lower or 'help' in message_lower or '사용법' in message_lower:
            reply = """📚 GlobaLink 사용법:

1️⃣ 지도에서 국가 클릭 또는 드롭다운에서 검색
2️⃣ 해당 국가의 뉴스 자동 로딩
3️⃣ 뉴스 카드 클릭하여 상세 내용 보기
4️⃣ 원문/번역본/요약본 탭으로 전환
5️⃣ 북마크로 관심 기사 저장

더 궁금한 점이 있으신가요? 🤗"""
        
        elif '호재' in message_lower or '악재' in message_lower or 'sentiment' in message_lower:
            reply = "📊 FinBERT AI 모델로 각 뉴스의 호재(📈)/악재(📉)/중립(➖)을 자동 분석해서 보여드려요! 뉴스 카드의 왼쪽 상단 배지를 확인해보세요."
        
        else:
            reply = f"'{message}' 에 대해 더 자세히 알려드리고 싶지만, 현재는 시뮬레이션 모드로 작동 중이에요. 💬 OpenAI API 키를 설정하면 더 똑똑하게 답변할 수 있어요!\n\n궁금한 점이 더 있으시면 물어보세요! 😊"
        
        return {
            'success': True,
            'reply': reply
        }


# 싱글톤 인스턴스
_chatbot_instance = None

def get_chatbot() -> ChatbotService:
    """싱글톤 패턴으로 챗봇 인스턴스 반환"""
    global _chatbot_instance
    if _chatbot_instance is None:
        _chatbot_instance = ChatbotService()
    return _chatbot_instance


# 테스트
if __name__ == "__main__":
    chatbot = get_chatbot()
    
    test_messages = [
        "안녕하세요!",
        "이 사이트는 어떻게 사용하나요?",
        "뉴스 번역은 어떻게 하나요?",
        "고맙습니다!"
    ]
    
    conversation = []
    
    for msg in test_messages:
        print(f"\n사용자: {msg}")
        result = chatbot.chat(msg, conversation)
        
        if result['success']:
            print(f"챗봇: {result['reply']}")
            # 대화 히스토리에 추가
            conversation.append({"role": "user", "content": msg})
            conversation.append({"role": "assistant", "content": result['reply']})
        else:
            print(f"오류: {result.get('error', '알 수 없는 오류')}")

