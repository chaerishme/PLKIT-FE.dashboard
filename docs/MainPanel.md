# 📄 MainPanel.js 리버스 엔지니어링 문서

## 1. 파일 개요
- **파일명**: `MainPanel.js`
- **목적**: 대시보드의 루트 컴포넌트 역할
- **특징**: Enact 기반, SPA 구조, 포커스 지원(Spotlight), 라우팅 관리

---

## 2. 사용 라이브러리 분석

| 라이브러리 | 설명 |
| --- | --- |
| **@enact/core/kind** | Enact 컴포넌트 생성 유틸리티 |
| **@enact/sandstone/ThemeDecorator** | Sandstone 테마 적용 |
| **@enact/sandstone/Panels** | (현재 사용 안함) |
| **@enact/spotlight/Spottable** | 포커스 가능한 버튼 생성 (HOC) |
| **@enact/spotlight/SpotlightContainerDecorator** | 포커스 관리 컨테이너 데코레이터 |
| **@enact/spotlight/SpotlightRootDecorator** | Spotlight 루트 지정 |
| **react-router-dom** | SPA 라우팅 기능 제공 (Router, Routes, Link 등) |

---

## 3. 주요 컴포넌트 구조
```
MainPanel
┣ Router (SPA 라우터)
┣ scrollContainer (전체 레이아웃)
┃ ┣ Nav (좌측 네비게이션 바 - 포커스 가능)
┃ ┃ ┣ 로고 이미지 (logo.png)
┃ ┃ ┣ SpottableButton (Overview)
┃ ┃ ┣ SpottableButton (Control)
┃ ┃ ┣ SpottableButton (VideoStream)
┃ ┃ ┣ SpottableButton (Flowcheck)
┃ ┃ ┗ SpottableButton (Community)
┃ ┗ contentArea (우측 콘텐츠 영역)
┃     ┗ Routes
┃        ┣ Overview
┃        ┣ Control
┃        ┣ VideoStream
┃        ┣ Flowcheck
┃        ┗ Community
┗ FloatingButton (플로팅 버튼)
```

---

## 4. 주요 기능 설명

### 🧩 좌측 Nav (네비게이션)
- `Nav = <nav>` + `SpotlightContainerDecorator`
- **리모컨, 키보드 포커스 이동 가능**
- 내부 버튼: `Spottable(Link)`로 구현

### 🧩 Routes (라우팅)
- `/` → Overview 컴포넌트
- `/control` → Control 컴포넌트
- `/VideoStream` → VideoStream 컴포넌트
- `/Flowcheck` → Flowcheck 컴포넌트
- `/Community` → Community 컴포넌트

### 🧩 FloatingButton
- 항상 화면에 떠있는 플로팅 액션 버튼

### 🧩 전체 App 데코레이터
- `ThemeDecorator`: Sandstone 테마 적용
- `SpotlightRootDecorator`: 앱 전체에 포커스 시스템 적용

---

## 5. 비고
- 전체 구조는 **좌측 Nav + 우측 콘텐츠 + 플로팅 버튼**으로 구성됨
- Enact + Spotlight + Router 기반으로 SPA 대시보드 구현

---

## 6. 학습 내용 정리
- 다양한 언어 사용 : JS + JSX + React (JSX = JavaScript + XML)
- SpottalbeButton = Link에 포커스(Spotlight) 기능을 추가한 커스텀 버튼 컴포넌트 
    -> 리모콘, 키보드로 포커스 이동 가능
- Enact의 Spotlight는 키보드나 리모컨으로 포커스를 이동할 수 있는 시스템.
- Router란? SPA(싱글 페이지 앱 구조)에서 페이지 이동(라우팅)을 관리하는 컴포넌트
- 라우팅을 위해서는 SpottableButton을 Link로 변경해야 함
- Enact에서 제공하는 고차 컴포넌트(Higher-Order Component)
        -> 컴포넌트를 인자로 받아서 새로운 컴포넌트 반환하는 함수. 기능을 추가해줌