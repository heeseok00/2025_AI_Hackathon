"""
FinBERT 기반 금융 뉴스 감성 분석 모듈
호재(positive), 악재(negative), 중립(neutral) 판단
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Dict, Optional
import os

class FinancialSentimentAnalyzer:
    def __init__(self):
        """FinBERT 모델 초기화"""
        try:
            print("FinBERT 모델 로딩 중...")
            model_name = "ProsusAI/finbert"
            
            # 모델과 토크나이저 로드
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
            
            # 평가 모드로 전환
            self.model.eval()
            
            # 레이블 매핑
            self.label_mapping = {
                0: "positive",    # 호재
                1: "negative",    # 악재
                2: "neutral"      # 중립
            }
            
            # 한글 레이블 매핑
            self.korean_label_mapping = {
                "positive": "호재",
                "negative": "악재",
                "neutral": "중립"
            }
            
            print("FinBERT 모델 로딩 완료!")
            
        except Exception as e:
            print(f"FinBERT 모델 로딩 실패: {e}")
            self.model = None
            self.tokenizer = None
    
    def analyze_sentiment(self, text: str) -> Optional[Dict]:
        """
        텍스트의 금융 감성 분석
        
        Args:
            text: 분석할 텍스트 (뉴스 제목 또는 요약)
            
        Returns:
            {
                'label': 'positive' | 'negative' | 'neutral',
                'korean_label': '호재' | '악재' | '중립',
                'confidence': 0.95,
                'scores': {
                    'positive': 0.95,
                    'negative': 0.03,
                    'neutral': 0.02
                }
            }
        """
        if not self.model or not self.tokenizer:
            print("FinBERT 모델이 로드되지 않았습니다")
            return None
        
        if not text or len(text.strip()) < 5:
            print("텍스트가 너무 짧습니다")
            return None
        
        try:
            # 텍스트 전처리 및 토크나이징
            # FinBERT는 최대 512 토큰까지 처리 가능
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            )
            
            # 예측 수행 (gradient 계산 불필요)
            with torch.no_grad():
                outputs = self.model(**inputs)
                predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
            
            # 결과 추출
            scores = predictions[0].tolist()
            predicted_class = torch.argmax(predictions, dim=-1).item()
            predicted_label = self.label_mapping[predicted_class]
            confidence = scores[predicted_class]
            
            result = {
                'label': predicted_label,
                'korean_label': self.korean_label_mapping[predicted_label],
                'confidence': round(confidence, 4),
                'scores': {
                    'positive': round(scores[0], 4),
                    'negative': round(scores[1], 4),
                    'neutral': round(scores[2], 4)
                }
            }
            
            print(f"감성 분석 결과: {result['korean_label']} (신뢰도: {result['confidence']:.2%})")
            return result
            
        except Exception as e:
            print(f"감성 분석 오류: {e}")
            return None
    
    def analyze_news(self, title: str, description: str = None) -> Optional[Dict]:
        """
        뉴스 제목과 설명을 결합하여 감성 분석
        
        Args:
            title: 뉴스 제목
            description: 뉴스 설명/요약 (선택사항)
            
        Returns:
            감성 분석 결과 딕셔너리
        """
        # 제목과 설명을 결합
        combined_text = title
        if description and len(description.strip()) > 0:
            combined_text = f"{title}. {description}"
        
        return self.analyze_sentiment(combined_text)


# 싱글톤 인스턴스 (메모리 절약을 위해 한 번만 로드)
_analyzer_instance = None

def get_sentiment_analyzer() -> FinancialSentimentAnalyzer:
    """싱글톤 패턴으로 감성 분석기 인스턴스 반환"""
    global _analyzer_instance
    if _analyzer_instance is None:
        _analyzer_instance = FinancialSentimentAnalyzer()
    return _analyzer_instance


# 사용 예시
if __name__ == "__main__":
    analyzer = get_sentiment_analyzer()
    
    # 테스트 뉴스
    test_cases = [
        {
            'title': 'Stock market hits record high as tech companies report strong earnings',
            'description': 'Major technology companies exceeded analyst expectations with robust quarterly results.'
        },
        {
            'title': 'Company files for bankruptcy amid mounting debts',
            'description': 'The struggling retailer announced Chapter 11 bankruptcy protection today.'
        },
        {
            'title': 'Central bank maintains interest rates unchanged',
            'description': 'Federal Reserve keeps rates steady as inflation remains stable.'
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n테스트 {i}:")
        print(f"제목: {test['title']}")
        print(f"설명: {test['description']}")
        result = analyzer.analyze_news(test['title'], test['description'])
        if result:
            print(f"결과: {result['korean_label']} ({result['confidence']:.2%})")
            print(f"상세: {result['scores']}")

