# 🌍 GlobaLink (글로바링크) - 글로벌 뉴스 플랫폼

해외 각국의 주요 뉴스를 AI가 자동으로 요약·번역하여, 국가별 트렌드를 한눈에 보여주는 글로벌 뉴스 플랫폼

---

## 📁 프로젝트 구조

```
hackaton/
├── 📄 설정 파일들
│   ├── package.json           # npm 프로젝트 설정 및 의존성 관리
│   ├── package-lock.json      # 의존성 버전 고정 (자동 생성)
│   ├── vite.config.js         # Vite 빌드 도구 설정
│   ├── tailwind.config.js     # TailwindCSS 스타일링 설정
│   ├── postcss.config.js      # CSS 후처리 설정 (Tailwind용)
│   ├── index.html             # HTML 진입점 (SPA의 루트)
│   ├── .gitignore             # Git에서 제외할 파일 목록
│   ├── .env.example           # 환경변수 템플릿
│   └── ENV_SETUP.md           # API 키 설정 가이드
│
├── 📁 public/                  # 정적 파일 (빌드 시 그대로 복사됨)
│   └── vite.svg               # Vite 로고
│
├── 📁 src/                     # 소스 코드 디렉토리
│   ├── main.jsx               # React 앱 진입점 (ReactDOM.render)
│   ├── App.jsx                # 앱 루트 컴포넌트
│   ├── index.css              # 전역 스타일 (Tailwind 포함)
│   │
│   ├── 📁 api/                 # API 통신 로직
│   │   ├── newsAPI.js         # News API 연동 (뉴스 데이터 수집)
│   │   └── translateAPI.js    # 번역 API 연동 (한국어 번역)
│   │
│   ├── 📁 components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── NewsCard.jsx       # 뉴스 카드 UI
│   │   ├── CountrySelector.jsx # 국가 선택 드롭다운
│   │   └── TrendMap.jsx       # 트렌드 지도 시각화
│   │
│   └── 📁 pages/               # 페이지 레벨 컴포넌트
│       └── Home.jsx           # 메인 홈페이지
│
└── 📁 node_modules/            # 설치된 npm 패키지 (자동 생성)
```

---

## 🔧 주요 파일 설명

### 📄 package.json
- **역할**: 프로젝트의 메타데이터와 의존성 패키지 목록
- **주요 내용**:
  - `dependencies`: 프로덕션에 필요한 패키지 (React, axios 등)
  - `devDependencies`: 개발 중에만 필요한 패키지 (Vite, TailwindCSS 등)
  - `scripts`: npm 명령어 단축키 (`npm run dev` 등)

### ⚡ vite.config.js
- **역할**: Vite 빌드 도구의 동작 방식 설정
- **주요 설정**:
  - `plugins: [react()]`: JSX 문법 지원
  - `server.port`: 개발 서버 포트 (5173)
  - `server.open`: 서버 시작 시 브라우저 자동 오픈

### 🎨 tailwind.config.js
- **역할**: TailwindCSS의 스타일링 범위 및 커스텀 설정
- **content**: Tailwind가 스캔할 파일 경로 (사용하지 않는 스타일 자동 제거)
- **theme**: 커스텀 색상, 폰트, 간격 등 추가 가능

### 📦 postcss.config.js
- **역할**: CSS 후처리기 설정 (TailwindCSS와 Autoprefixer 연동)
- **autoprefixer**: 구형 브라우저 호환을 위한 CSS prefix 자동 추가

### 🌐 index.html
- **역할**: SPA(Single Page Application)의 HTML 진입점
- **특징**: `<div id="root"></div>`에 React 앱이 마운트됨
- **script**: `/src/main.jsx`를 ES Module로 로드

### 🚀 src/main.jsx
- **역할**: React 애플리케이션의 JavaScript 진입점
- **동작**:
  1. `root` 엘리먼트를 찾음
  2. React 18의 `createRoot` API로 루트 생성
  3. `<App />` 컴포넌트 렌더링
  4. 전역 스타일(`index.css`) 임포트

### 🎯 src/App.jsx
- **역할**: 애플리케이션의 최상위 컴포넌트
- **현재**: `<Home />` 페이지를 렌더링
- **향후**: 라우팅 추가 시 여러 페이지 관리 가능

### 💅 src/index.css
- **역할**: 전역 CSS 스타일 (TailwindCSS 포함)
- **구조**:
  ```css
  @tailwind base;       /* Tailwind 기본 리셋 */
  @tailwind components; /* 재사용 가능한 컴포넌트 스타일 */
  @tailwind utilities;  /* 유틸리티 클래스 */
  ```

---

## 📂 src/ 디렉토리 상세

### 📁 api/
**목적**: 외부 API와의 통신 로직을 분리하여 관리

#### `newsAPI.js`
- **역할**: News API로부터 국가별 뉴스 데이터 수집
- **함수**: `fetchNews({ countryCode })`
- **향후 구현**: axios로 HTTP 요청, 에러 처리, 캐싱

#### `translateAPI.js`
- **역할**: 뉴스 텍스트를 한국어로 번역
- **함수**: `translateText(text, targetLang)`
- **향후 구현**: Google Translate API 또는 Papago API 연동

### 📁 components/
**목적**: 재사용 가능한 독립적인 UI 컴포넌트

#### `NewsCard.jsx`
- **역할**: 개별 뉴스 기사를 카드 형태로 표시
- **Props**: `title`, `description`, `source`, `url`
- **특징**: 제목, 설명, 출처, 링크를 시각적으로 정리

#### `CountrySelector.jsx`
- **역할**: 국가 선택 UI (드롭다운 → 지도 클릭으로 변경 예정)
- **Props**: `value`, `onChange`, `countries`
- **기본 국가**: 미국, 한국, 일본, 영국, 독일

#### `TrendMap.jsx`
- **역할**: 국가별 트렌드를 지도 기반으로 시각화
- **현재**: Placeholder (JSON 데이터 출력)
- **향후**: D3.js 또는 Chart.js로 인터랙티브 지도 구현

### 📁 pages/
**목적**: 전체 페이지를 구성하는 컨테이너 컴포넌트

#### `Home.jsx`
- **역할**: 메인 홈페이지 레이아웃
- **상태 관리**:
  - `country`: 선택된 국가 코드
  - `articles`: 뉴스 기사 배열
- **동작**:
  1. 국가 선택 시 `fetchNews()` 호출
  2. 뉴스 데이터를 `NewsCard`로 렌더링
  3. `TrendMap`에 데이터 전달

---

## 🚀 실행 방법

### 1️⃣ 개발 서버 실행
```bash
npm run dev
```
- 로컬 서버 시작: http://localhost:5173
- **HMR (Hot Module Replacement)** 활성화 → 코드 수정 시 자동 반영
- 저장만 하면 브라우저에 즉시 업데이트!

### 2️⃣ 프로덕션 빌드
```bash
npm run build
```
- `dist/` 폴더에 최적화된 정적 파일 생성
- 코드 압축, Tree-shaking, 번들 최적화

### 3️⃣ 빌드 결과 미리보기
```bash
npm run preview
```
- 빌드된 결과를 로컬 서버로 테스트

---

## 🔑 환경 변수 설정

API 연동 시 `.env` 파일 필요:

```bash
VITE_NEWS_API_KEY=your_key_here
VITE_OPENAI_API_KEY=your_key_here
```

자세한 내용은 `ENV_SETUP.md` 참고

---

## 🛠️ 기술 스택

| 카테고리 | 기술 | 역할 |
|---------|------|------|
| **프레임워크** | React 18 | UI 컴포넌트 기반 개발 |
| **빌드 도구** | Vite 5 | 초고속 개발 서버 & 빌드 |
| **스타일링** | TailwindCSS 3 | 유틸리티 기반 CSS 프레임워크 |
| **HTTP 클라이언트** | Axios | API 요청 관리 |
| **패키지 관리** | npm | 의존성 설치 및 관리 |

---

## 📝 개발 가이드

### 컴포넌트 추가
```jsx
// src/components/MyComponent.jsx
import React from 'react';

export default function MyComponent({ prop1, prop2 }) {
  return <div>{/* 내용 */}</div>;
}
```

### API 함수 추가
```javascript
// src/api/myAPI.js
import axios from 'axios';

export async function fetchData() {
  const response = await axios.get('https://api.example.com/data');
  return response.data;
}
```

### TailwindCSS 사용
```jsx
<div className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg">
  Hello World
</div>
```

---

## 🐛 트러블슈팅

### 서버가 시작되지 않을 때
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

### 포트가 이미 사용 중일 때
```bash
# 5173 포트를 사용하는 프로세스 종료 (Mac/Linux)
lsof -ti:5173 | xargs kill -9
```

### Tailwind 스타일이 적용되지 않을 때
- `tailwind.config.js`의 `content` 경로 확인
- `src/index.css`가 `main.jsx`에서 import 되었는지 확인

---

## 📚 참고 자료

- [Vite 공식 문서](https://vitejs.dev/)
- [React 공식 문서](https://react.dev/)
- [TailwindCSS 공식 문서](https://tailwindcss.com/)
- [News API 문서](https://newsapi.org/docs)

---

## 👥 팀

해커톤 프로젝트 - 2025 AI Hackathon
