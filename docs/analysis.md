# 🔍 PLKIT-FE.dashboard 구조 분석

## 1. 분석 목적
- 기존의 프로젝트 분석하여 구조 파악
- 공모전 및 프로젝트를 위한 사전 조사

## 2. 분석 대상
FE.dashboard 전체 파일 

## 3. 분석 순서


```c
npm run serve // 터미널에 입력
http://localhost:8080/    // 웹 브라우저에 입력
```

* [x] 1. 서버 켜서 웹 브라우저에서 직접 확인! 

Overview, VideoStream, Flow Check는 화면 안 나옴

전체 tree 구조

```
PLKIT-FE.dashboard
├── .env                  # 환경 변수 설정 파일
├── .gitignore            # Git에서 제외할 파일 목록
├── package-lock.json     # npm 패키지 종속성 관리 파일
├── package.json          # 프로젝트 설정 파일
├── README.md             # 프로젝트 설명 파일
├── src
│   ├── App
│   │   ├── App.js                  # 애플리케이션 메인 컴포넌트
│   │   └── App.module.less         # 메인 스타일 파일
│   ├── assets                      # 프로젝트에 필요한 이미지 및 아이콘
│   ├── components                  # UI 컴포넌트 폴더
│   │   ├── ChatGPTComponent.js     # AI 챗봇 컴포넌트
│   │   ├── Community.js            # 커뮤니티 기능 컴포넌트
│   │   ├── Control.js              # 원격 제어 컴포넌트
│   │   ├── Overview.js             # 데이터 시각화 대시보드
│   │   ├── VideoStream.js          # 실시간 비디오 스트리밍 컴포넌트
│   │   └── (기타 컴포넌트들)
│   ├── hooks                       # 커스텀 훅 폴더
│   │   ├── usePredictionData.js    # AI 예측 데이터 훅
│   │   └── useSmartFarmData.js     # 스마트팜 데이터 관리 훅
│   ├── utils
│   │   └── exportChart.js          # 차트 내보내기 유틸리티
│   └── views
│       └── MainPanel.js            # 대시보드 메인 화면
├── public
│   ├── index.html                  # HTML 템플릿 파일
│   └── imgs                        # 이미지 파일 폴더
└── node_modules                    # 프로젝트 의존성 모듈
```

* [x] 2. 전체 화면 컴포넌트 매칭

src/views/MainPanel.js 열어서 어떤 컴포넌트 import하는지 확인

→ 대시보드 구성 요소가 무엇인지 파악

* [x] 3. 1에서 확인한 화면이 어떤 컴포넌트로 이루어졌는가?

→ src/components 를 통해 주요 컴포넌트 구조 파악

* [ ] 4. 데이터 흐름 파악 

→ src/hooks를 통해 어떤 훅을 사용하는지, fetch로 받아오는 데이터, MQTT로 들어오는 데이터를 어떤 props로 넘겨주는지 확인

* [ ] 5.  스타일, 에셋 체크

→ src/App/App.module.less, src/assets/

* [ ] 6. 부가 기능 파악 (내보내기, 유틸리티)

→ src/utils/exportChart.js

* [ ] 7. env 환경 변수 체크

→ MQTT & API 호출에 쓰이는 서버 주소 확인

.env 파일 열어서 MQTT 브로커 주소나 API 서버 주소가 어디인지 확인

* [ ] 8. 총 정리
- 어떤 컴포넌트가 중요했는가?
- 데이터 흐름이 어떻게 되는가?
- 실시간 & API 흐름 차이 (실시간은 자동으로 서버에서 push, API는 단발성으로 필요할 때만 가져옴)

## 4. 분석 결과

