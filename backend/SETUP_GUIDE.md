# FinBERT 감성 분석 백엔드 설정 가이드

## 📋 요구사항

- Python 3.9 이상
- 최소 4GB RAM (FinBERT 모델 로딩)
- 인터넷 연결 (모델 다운로드)

## 🚀 설치 방법

### 1. 가상환경 활성화

#### macOS/Linux:
```bash
cd backend
source venv/bin/activate
```

#### Windows:
```bash
cd backend
venv\Scripts\activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

**참고:** 처음 실행 시 다음 패키지들이 설치됩니다:
- `transformers==4.35.2` - Hugging Face Transformers (FinBERT 모델)
- `torch==2.1.1` - PyTorch (딥러닝 프레임워크)

설치에는 인터넷 속도에 따라 5-10분 정도 소요될 수 있습니다.

### 3. 서버 실행

```bash
python app.py
```

서버가 성공적으로 시작되면 다음과 같은 메시지를 볼 수 있습니다:
```
FinBERT 모델 로딩 중...
FinBERT 모델 로딩 완료!
 * Running on http://0.0.0.0:5000
```

## 🧪 테스트

### API 엔드포인트 테스트

1. **서버 상태 확인:**
```bash
curl http://localhost:5000/api/health
```

2. **감성 분석 테스트:**
```bash
curl -X POST http://localhost:5000/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Stock market hits record high as tech companies report strong earnings",
    "description": "Major technology companies exceeded analyst expectations with robust quarterly results."
  }'
```

**예상 응답:**
```json
{
  "success": true,
  "sentiment": {
    "label": "positive",
    "korean_label": "호재",
    "confidence": 0.9523,
    "scores": {
      "positive": 0.9523,
      "negative": 0.0234,
      "neutral": 0.0243
    }
  }
}
```

## 📊 FinBERT 모델 정보

### 첫 실행 시 모델 다운로드

처음 서버를 시작하면 FinBERT 모델이 자동으로 다운로드됩니다:
- 모델 크기: 약 440MB
- 저장 위치: `~/.cache/huggingface/transformers/`
- 다운로드는 한 번만 수행됩니다

### 메모리 사용량

- 모델 로딩 시: 약 1-2GB RAM
- 추론(inference) 시: 추가 500MB-1GB RAM
- 권장: 최소 4GB 이상의 시스템 RAM

## ⚠️ 문제 해결

### 1. 모델 로딩 실패

**증상:**
```
FinBERT 모델 로딩 실패: ...
```

**해결 방법:**
```bash
# transformers 재설치
pip uninstall transformers torch
pip install transformers==4.35.2 torch==2.1.1
```

### 2. 메모리 부족 오류

**증상:**
```
RuntimeError: [enforce fail at alloc_cpu.cpp:...] 
```

**해결 방법:**
- 다른 프로그램을 종료하여 메모리 확보
- 시스템 RAM이 4GB 미만인 경우 업그레이드 권장

### 3. 인터넷 연결 오류 (첫 실행 시)

**증상:**
```
OSError: Can't load tokenizer for 'ProsusAI/finbert'
```

**해결 방법:**
- 인터넷 연결 확인
- 방화벽 설정 확인
- 프록시 사용 시 환경변수 설정:
```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
```

### 4. Windows에서 torch 설치 오류

**증상:**
```
ERROR: Could not find a version that satisfies the requirement torch
```

**해결 방법:**
```bash
# Windows용 PyTorch 설치
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install transformers==4.35.2
```

## 🔧 고급 설정

### GPU 사용 (선택사항)

NVIDIA GPU가 있는 경우 추론 속도를 높일 수 있습니다:

1. **CUDA 버전 확인:**
```bash
nvidia-smi
```

2. **GPU용 PyTorch 설치:**
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

3. **sentiment_analyzer.py 수정:**
```python
# GPU 사용 설정
self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
self.model.to(self.device)
```

### 모델 캐시 위치 변경

기본 캐시 디렉토리를 변경하려면:

```bash
export TRANSFORMERS_CACHE=/path/to/cache
export HF_HOME=/path/to/cache
```

## 📚 추가 리소스

- [FinBERT Model Card](https://huggingface.co/ProsusAI/finbert)
- [Transformers Documentation](https://huggingface.co/docs/transformers)
- [PyTorch Documentation](https://pytorch.org/docs/stable/index.html)

## 💡 팁

1. **모델 로딩 시간 단축:**
   - 서버를 계속 실행 상태로 유지
   - 모델은 한 번만 로드되고 메모리에 유지됩니다

2. **배치 처리:**
   - 여러 뉴스를 분석할 때는 개별 요청보다 배치 처리가 효율적

3. **캐싱:**
   - 동일한 뉴스에 대한 감성 분석 결과를 캐싱하면 성능 향상

---

**문제가 계속되면 GitHub Issue를 생성해주세요!** 🙏

