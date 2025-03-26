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



⸻


### 2. 부가 기능 파악 (내보내기, 유틸리티)
