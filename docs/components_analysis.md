### /src/components 내부 파일 요약

| 컴포넌트 | 역할 설명 |
| --- | --- |
| **Overview.js** | 대시보드 메인화면 (데이터 시각화) |
| **Control.js** | 제어 관련 페이지 |
| **VideoStream.js** | 실시간 영상 스트리밍 페이지 |
| **Flowcheck.js** | 유량 체크, 센서 데이터 시각화 |
| **Community.js** | 커뮤니티 기능, 사용자 간 소통 |
| **FloatingButton.js** | 대시보드 내 플로팅 액션 버튼 |
| **Nav.js** | 좌측 네비게이션 컴포넌트 (MainPanel 내 사용 예상) |
| **ChatGPTComponent.js** | AI 챗봇 or AI 기반 인터랙션 컴포넌트 |
| **Webview.js** | 외부 페이지나 앱 임베딩 용도 |
| **각종 Table 컴포넌트** | `PredictionTable`, `TdsTable`, `WaterLevelTable` 등 다양한 센서/데이터 테이블 출력 |
| **IlluminationTable.js** | 조도 데이터 테이블 |
| **LiquidTempTable.js** | 액체 온도 데이터 테이블 |
| **TempHumTable.js** | 온습도 데이터 테이블 |
<br>

MainPanel.js에서 import한 주요 components 목록
```
import Overview from "../components/Overview";
import Flowcheck from "../components/Flowcheck";
import Community from "../components/Community";
import VideoStream from "../components/VideoStream";
import Control from "../components/Control";
import FloatingButton from "../components/FloatingButton";
```
위의 파일 중점적으로 분석.
<br><br>

---
### Overview.js
스마트팜 대시보드 메인 화면<br>
각 센서별 데이터를 차트/테이블로 보여줌 (토글 가능)

|기술|설명|
|---|---|
|React|상태 관리, DOM 참조 사용|
|Enact Sandstone|Enact 기반 레이아웃 UI 사용|
|Recharts|데이터 시각화 라이브러리|
|**Custom Hook**|**useSmartFarmData()로 스마트팜 데이터 수집**|
<br>

`import useSmartFarmData from "../hooks/useSmartFarmData";`<bR>
`const { data } = useSmartFarmData(); `
: 스마트팜 관련 실시간/정적 데이터를 외부에서 받아옴.

<br>

---

### Control.js
스마트팜 장비 및 자원 수치를 제어하는 패널 제공<br>
스위치 / 슬라이더 / 버튼으로 다양한 기기와 수치 조작 가능 <br>
대부분의 로직은 **useSmartFarmData()** 커스텀 훅에서 처리됨 (상태 및 이벤트)
<br>

---

### Community.js
외부 커뮤니티 웹페이지를 앱 내에 임베딩 (iframe) : https://test-chi-three-99.vercel.app/login <br>
단일 iframe으로 외부 페이지 로딩하는 단순한 구조 <br>
MainPanel 메뉴에서 Community 누르면 바로 이 컴포넌트 실행됨
<br>

---