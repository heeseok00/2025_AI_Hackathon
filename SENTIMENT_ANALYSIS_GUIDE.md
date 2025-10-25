# 📊 호재/악재 분석 기능 사용 가이드

## 🎯 개요

FinBERT 모델을 사용하여 뉴스의 감성을 자동으로 분석하고 호재/악재를 판단하는 기능입니다.

![FinBERT](https://huggingface.co/ProsusAI/finbert)

## ✨ 주요 기능

### 자동 감성 분석
- 모든 뉴스 카드에 자동으로 호재/악재 배지 표시
- 뉴스 제목과 요약을 기반으로 AI가 자동 분석
- 실시간 분석 및 신뢰도 점수 제공

### 3가지 분류
1. **📈 호재 (Positive)** - 긍정적인 금융 뉴스
   - 예: 실적 개선, 주가 상승, 긍정적 전망
   - 초록색 배지로 표시

2. **📉 악재 (Negative)** - 부정적인 금융 뉴스
   - 예: 실적 악화, 주가 하락, 부정적 전망
   - 빨간색 배지로 표시

3. **➖ 중립 (Neutral)** - 중립적인 뉴스
   - 예: 단순 발표, 중립적 사실 전달
   - 회색 배지로 표시

## 🚀 사용 방법

### 1. 백엔드 서버 시작

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt  # 처음 실행 시
python app.py
```

**첫 실행 시:**
- FinBERT 모델이 자동으로 다운로드됩니다 (약 440MB)
- 모델 로딩에 20-30초 정도 소요됩니다

```
FinBERT 모델 로딩 중...
FinBERT 모델 로딩 완료!
 * Running on http://0.0.0.0:5000
```

### 2. 프론트엔드 실행

```bash
npm install  # 처음 실행 시
npm run dev
```

### 3. 뉴스 확인

1. 브라우저에서 `http://localhost:5173` 접속
2. 지도에서 국가 선택 (미국, 독일, 인도, 일본)
3. 뉴스 카드의 왼쪽 상단에 호재/악재 배지 확인
4. 배지에 마우스를 올리면 신뢰도 점수 확인 가능

## 🧪 테스트

### 백엔드 테스트 스크립트 실행

```bash
cd backend
python test_sentiment.py
```

**출력 예시:**
```
============================================================
FinBERT 감성 분석 테스트
============================================================

1. 분석기 초기화 중...
✅ 분석기 초기화 완료!

2. 테스트 케이스 실행:
------------------------------------------------------------

테스트 1/5:
제목: Stock market hits record high as tech companies report strong earnings
설명: Major technology companies exceeded analyst expectations...
예상: positive
결과: positive (호재)
신뢰도: 95.23%
상세 점수:
  - 호재: 0.9523
  - 악재: 0.0234
  - 중립: 0.0243
✅ 테스트 통과!
```

### API 직접 테스트

```bash
curl -X POST http://localhost:5000/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tesla stock surges on record deliveries",
    "description": "Electric vehicle maker reports best quarter ever"
  }'
```

**응답:**
```json
{
  "success": true,
  "sentiment": {
    "label": "positive",
    "korean_label": "호재",
    "confidence": 0.9234,
    "scores": {
      "positive": 0.9234,
      "negative": 0.0432,
      "neutral": 0.0334
    }
  }
}
```

## 💡 실제 사용 예시

### 예시 1: 긍정적 뉴스
**제목:** "Apple Reports Record Quarterly Revenue"  
**설명:** "Tech giant beats analyst expectations with strong iPhone sales"  
**결과:** 📈 **호재** (신뢰도: 94.5%)

### 예시 2: 부정적 뉴스
**제목:** "Bank Stocks Plunge as Credit Concerns Mount"  
**설명:** "Regional banks face pressure amid rising loan defaults"  
**결과:** 📉 **악재** (신뢰도: 91.2%)

### 예시 3: 중립적 뉴스
**제목:** "Federal Reserve Maintains Current Interest Rate"  
**설명:** "Central bank keeps policy unchanged as expected"  
**결과:** ➖ **중립** (신뢰도: 87.3%)

## 🎨 UI 구현 상세

### 배지 디자인

```jsx
{sentiment && (
  <div className="absolute top-3 left-3 z-10">
    <div className={`
      px-3 py-1.5 rounded-full font-bold text-sm shadow-lg backdrop-blur-sm
      flex items-center gap-1.5 transition-all duration-300
      ${sentiment.label === 'positive' 
        ? 'bg-green-500/90 text-white border border-green-400' 
        : sentiment.label === 'negative'
        ? 'bg-red-500/90 text-white border border-red-400'
        : 'bg-gray-500/90 text-white border border-gray-400'
      }
    `}>
      {sentiment.label === 'positive' && '📈'}
      {sentiment.label === 'negative' && '📉'}
      {sentiment.label === 'neutral' && '➖'}
      <span>{sentiment.korean_label}</span>
    </div>
  </div>
)}
```

### 로딩 상태

```jsx
{isAnalyzingSentiment && (
  <div className="absolute top-3 left-3 z-10">
    <div className="px-3 py-1.5 rounded-full bg-gray-500/80 text-white">
      <div className="animate-spin h-3 w-3 border-2 border-white"></div>
      <span>분석중...</span>
    </div>
  </div>
)}
```

## 📈 성능 최적화

### 병렬 처리
뉴스 카드가 여러 개일 때 감성 분석이 병렬로 처리됩니다:

```javascript
useEffect(() => {
  const analyzeSentimentContent = async () => {
    setIsAnalyzingSentiment(true);
    try {
      const result = await analyzeSentiment(title, description);
      if (result.success && result.sentiment) {
        setSentiment(result.sentiment);
      }
    } finally {
      setIsAnalyzingSentiment(false);
    }
  };
  analyzeSentimentContent();
}, [title, description]);
```

### 캐싱 전략 (권장)
동일한 뉴스에 대한 반복 분석을 방지하기 위해 클라이언트 측 캐싱 구현 가능:

```javascript
// localStorage 캐싱 예시
const getCachedSentiment = (articleId) => {
  const cached = localStorage.getItem(`sentiment_${articleId}`);
  if (cached) {
    const { sentiment, timestamp } = JSON.parse(cached);
    // 24시간 이내면 캐시 사용
    if (Date.now() - timestamp < 86400000) {
      return sentiment;
    }
  }
  return null;
};
```

## ⚠️ 주의사항

### 언어 제한
- FinBERT는 **영어 모델**입니다
- 한국어 뉴스는 영어로 번역 후 분석됩니다
- 번역 품질이 분석 정확도에 영향을 줄 수 있습니다

### 금융 뉴스 특화
- 일반 뉴스보다 **금융/경제 뉴스**에 더 정확합니다
- 정치, 스포츠, 연예 뉴스는 분석 정확도가 낮을 수 있습니다

### 신뢰도 해석
- **90% 이상**: 매우 높은 신뢰도
- **70-90%**: 높은 신뢰도
- **50-70%**: 중간 신뢰도
- **50% 미만**: 낮은 신뢰도 (결과 참고용)

## 🔧 문제 해결

### 배지가 표시되지 않음
1. 백엔드 서버가 실행 중인지 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. `http://localhost:5000/api/health` 접속하여 서버 상태 확인

### 분석 속도가 느림
1. 처음 실행 시 모델 로딩으로 20-30초 소요 (정상)
2. 이후에는 뉴스당 1-2초 내외로 빠르게 분석
3. GPU를 사용하면 더 빠른 분석 가능

### 메모리 부족
- FinBERT 모델은 약 1-2GB RAM 사용
- 시스템 RAM이 4GB 미만이면 문제 발생 가능
- 다른 프로그램을 종료하거나 RAM 업그레이드 권장

## 📚 참고 자료

### FinBERT 논문
- **제목:** FinBERT: Financial Sentiment Analysis with Pre-trained Language Models
- **링크:** [https://arxiv.org/abs/1908.10063](https://arxiv.org/abs/1908.10063)
- **저자:** Dogu Araci (Prosus AI)

### Hugging Face 모델 카드
- **링크:** [https://huggingface.co/ProsusAI/finbert](https://huggingface.co/ProsusAI/finbert)
- **다운로드:** 997 likes, 2.3M+ downloads

### 기술 스택
- **모델:** BERT-base (110M parameters)
- **훈련 데이터:** Financial PhraseBank
- **정확도:** 약 95% (금융 뉴스 기준)

## 🎓 학습 자료

### FinBERT가 작동하는 방식
1. 뉴스 제목과 설명을 토큰화
2. BERT 모델을 통해 문맥 이해
3. 금융 도메인 지식을 활용하여 감성 분류
4. 3가지 레이블에 대한 확률 점수 계산
5. 가장 높은 점수의 레이블 선택

### 왜 금융 뉴스에 특화되었나?
- 일반 BERT는 금융 용어를 정확히 이해하지 못함
- FinBERT는 금융 데이터로 추가 학습됨
- "bullish", "bearish", "volatility" 등 금융 용어 이해

---

## 💬 피드백 및 문의

더 많은 정보가 필요하시거나 문제가 발생하면 GitHub Issue를 생성해주세요!

**Happy Analyzing! 📊🚀**

