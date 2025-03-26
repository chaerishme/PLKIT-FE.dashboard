1. 스타일, 에셋 체크
2. 부가 기능 파악 (내보내기, 유틸리티)
3. env 환경 변수 체크

⸻


### 1. 스타일, 에셋 체크
**App.module.less** 스타일 구조

🎨 전반적인 디자인 특징
	•	다크 테마 기반 (#1f1f1f, #2c2c2c, #333, 등)
	•	카드 기반 UI: card, controlCard, sliderContainer 등
	•	모듈화된 스타일: 각 기능/섹션마다 클래스 분리
	•	반응형 레이아웃: flex, grid 적절히 사용
	•	툴팁, 버튼 효과, 입력 필드 등 상호작용 요소에 시각적 효과 적용


<br>
🧱 레이아웃 구성

|클래스명|설명|
|---|---|
|.scrollContainer|전체 화면 기준 스크롤 컨테이너|
|.container|콘텐츠 너비 제한 및 중앙 정렬|
|.dashboard|카드형 레이아웃, flex-wrap으로 반응형|
|.controlGridLayout|좌우 1:2 비율의 Grid 레이아웃|
|.controlLeft, .controlRight|양쪽 영역 구성용 flex/grid|



<br>
📦 UI 컴포넌트 스타일

|클래스명|설명|
|---|---|
|.card, .controlCard|공통 카드 스타일. 배경, 패딩, 그림자 등|
|.sliderContainer|슬라이더 카드 전용 스타일|
|.switch, .slider|토글 스위치 관련 스타일 (커스텀 슬라이더 포함)|
|.chart-container, .chartWrapper|차트 가로 스크롤 처리|
|.navBar|사이드 내비게이션 바 디자인|
|.navButton|내비게이션 버튼 hover 효과 포함|


<br>
📊 상호작용 요소

|요소|설명|
|---|---|
|input[type="range"]|슬라이더 바 색상, 너비 설정|
|.level-buttons button|버튼 hover 시 색상 변경 및 툴팁 표시|
|.tooltip|프로그레스 바, 버튼 등에 연결된 설명 툴팁|
|.progressBar, .progressFill|수위 표시용 프로그레스 바 스타일|


<br>
💬 텍스트 및 기타 요소

|클래스명|설명|
|---|---|
|.textSection|정보 강조 영역 (글자 크기, 색상 강조)|
|.nutrientSpan, .recycleSpan|각각 다른 강조 배경색|
|.waterLevelText|수위 텍스트 크기 강조 (font-size: 70px)|



---

<br>

### 2. 부가 기능 파악 (내보내기, 유틸리티)
**src/utils/exportChart.js**

📤 차트 내보내기 기능 (`exportChart.js`)

대시보드 상의 차트를 이미지로 캡처하여 PDF 또는 Word 문서로 저장할 수 있는 기능 제공

---

✅ 주요 기능

| 함수명 | 설명 |
|--------|------|
| `saveChartAsPDF(chartRef, title)` | 차트를 PDF 문서로 저장 |
| `saveChartAsWord(chartRef, title)` | 차트를 Word(.docx) 문서로 저장 |
<br>
---
<br>
📦 사용 라이브러리

- [`html2canvas`](https://github.com/niklasvh/html2canvas): HTML DOM을 이미지로 캡처
- [`jspdf`](https://github.com/parallax/jsPDF): PDF 생성 및 저장
- [`docx`](https://github.com/dolanmiu/docx): Word 문서 생성
- [`file-saver`](https://github.com/eligrey/FileSaver.js): 브라우저에서 파일 저장 처리

<br>

---

🛠️ 사용 방식

두 함수 모두 `chartRef`를 인자로 받아 해당 DOM 영역을 캡처

```jsx
import { saveChartAsPDF, saveChartAsWord } from "@/utils/exportChart";

const handleSavePDF = () => {
  saveChartAsPDF(chartRef, "차트_이름");
};

const handleSaveWord = () => {
  saveChartAsWord(chartRef, "차트_이름");
};
```

<br>

---

### 3. env 환경 변수 체크

`useSmartFarmData.js` 분석을 통해 `.env` 파일이 존재하는 것으로 추정되나, 현재 프로젝트에는 공유되지 않은 상태.

해당 파일에 포함되어야 할 것으로 예상되는 환경 변수 목록은 아래와 같다:

```env
# 백엔드 API 서버 주소
REACT_APP_BASE_URL=localhost:8000

# MQTT 브로커 연결 정보
REACT_APP_MQTT_HOST=mqtt.example.com
REACT_APP_MQTT_PORT=8883
REACT_APP_MQTT_PROTOCOL=wss
```

<br>

📌 설명

	•	REACT_APP_BASE_URL: 초기 데이터를 가져오는 API 서버 주소. 현재 코드에선 fetch("http://<BASE_URL>/dummy/status/…") 형태로 사용됨.

	•	REACT_APP_MQTT_HOST: MQTT 브로커 주소. 예: mqtt.plkit.io 또는 로컬 테스트용 localhost

	•	REACT_APP_MQTT_PORT: 보통 1883 (mqtt), 8883 (wss) 사용됨

	•	REACT_APP_MQTT_PROTOCOL: mqtt, ws, wss 중 하나. 브라우저에서 보통 wss 사용

<br>

🧩 참고 사항

	•	.env 파일은 .gitignore에 포함되어 있으므로 Git에는 업로드되지 않음.

	•	실제 배포 시에는 환경별로 .env.production, .env.development 등을 나눠 관리할 수 있음.
    
	•	.env 파일을 변경한 후에는 반드시 개발 서버를 재시작해야 적용됨.