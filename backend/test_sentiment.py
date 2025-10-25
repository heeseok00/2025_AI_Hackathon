"""
FinBERT 감성 분석 테스트 스크립트
"""

from sentiment_analyzer import get_sentiment_analyzer

def test_sentiment_analysis():
    """감성 분석 테스트"""
    print("=" * 60)
    print("FinBERT 감성 분석 테스트")
    print("=" * 60)
    
    # 분석기 초기화
    print("\n1. 분석기 초기화 중...")
    analyzer = get_sentiment_analyzer()
    
    if not analyzer.model or not analyzer.tokenizer:
        print("❌ 모델 로딩 실패!")
        return
    
    print("✅ 분석기 초기화 완료!")
    
    # 테스트 케이스
    test_cases = [
        {
            'title': 'Stock market hits record high as tech companies report strong earnings',
            'description': 'Major technology companies exceeded analyst expectations with robust quarterly results.',
            'expected': 'positive'
        },
        {
            'title': 'Company files for bankruptcy amid mounting debts',
            'description': 'The struggling retailer announced Chapter 11 bankruptcy protection today.',
            'expected': 'negative'
        },
        {
            'title': 'Central bank maintains interest rates unchanged',
            'description': 'Federal Reserve keeps rates steady as inflation remains stable.',
            'expected': 'neutral'
        },
        {
            'title': 'Tesla stock surges on record deliveries',
            'description': 'Electric vehicle maker reports best quarter ever with deliveries exceeding expectations.',
            'expected': 'positive'
        },
        {
            'title': 'Bank reports massive losses due to loan defaults',
            'description': 'Regional bank faces crisis as commercial real estate loans fail.',
            'expected': 'negative'
        }
    ]
    
    print("\n2. 테스트 케이스 실행:")
    print("-" * 60)
    
    correct = 0
    total = len(test_cases)
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n테스트 {i}/{total}:")
        print(f"제목: {test['title']}")
        print(f"설명: {test['description']}")
        print(f"예상: {test['expected']}")
        
        result = analyzer.analyze_news(test['title'], test['description'])
        
        if result:
            print(f"결과: {result['label']} ({result['korean_label']})")
            print(f"신뢰도: {result['confidence']:.2%}")
            print(f"상세 점수:")
            print(f"  - 호재: {result['scores']['positive']:.4f}")
            print(f"  - 악재: {result['scores']['negative']:.4f}")
            print(f"  - 중립: {result['scores']['neutral']:.4f}")
            
            if result['label'] == test['expected']:
                print("✅ 테스트 통과!")
                correct += 1
            else:
                print(f"❌ 테스트 실패 (예상: {test['expected']}, 결과: {result['label']})")
        else:
            print("❌ 분석 실패!")
    
    print("\n" + "=" * 60)
    print(f"테스트 결과: {correct}/{total} 통과 ({correct/total*100:.1f}%)")
    print("=" * 60)

def test_korean_news():
    """한국어 뉴스 테스트 (영어로 번역 필요)"""
    print("\n" + "=" * 60)
    print("한국어 뉴스 테스트 (영어 제목 필요)")
    print("=" * 60)
    
    analyzer = get_sentiment_analyzer()
    
    korean_cases = [
        {
            'title': 'Samsung reports record profits in semiconductor division',
            'description': 'Korean tech giant sees massive growth in chip sales',
            'korean_title': '삼성전자, 반도체 부문 사상 최대 실적 기록'
        },
        {
            'title': 'Korean Air faces turbulence with rising fuel costs',
            'description': 'Airline struggles with increasing operational expenses',
            'korean_title': '대한항공, 유가 상승으로 어려움 겪어'
        }
    ]
    
    print("\n참고: FinBERT는 영어 모델이므로 한국어 뉴스는 영어로 번역 후 분석해야 합니다.")
    print("-" * 60)
    
    for i, test in enumerate(korean_cases, 1):
        print(f"\n테스트 {i}:")
        print(f"한국어: {test['korean_title']}")
        print(f"영어: {test['title']}")
        
        result = analyzer.analyze_news(test['title'], test['description'])
        
        if result:
            print(f"결과: {result['korean_label']} (신뢰도: {result['confidence']:.2%})")
        else:
            print("❌ 분석 실패!")

if __name__ == "__main__":
    try:
        test_sentiment_analysis()
        test_korean_news()
        
        print("\n" + "=" * 60)
        print("✅ 모든 테스트 완료!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()

