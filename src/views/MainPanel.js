// NOTE:
// core library : Enact 기반의 응용 프로그램을 위한 필수 요소로 구성된 라이브러리
// sandstone library : Smart TV에 사용되는 Enact 기반의 component로 구성된 라이브러리, webOS 6.0 이후 webOS TV에 적용
// spotlight library :  // Enact 기반의 응용 프로그램을 위한 필수 요소로 구성된 라이브러리
import kind from "@enact/core/kind";  
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import Panels from "@enact/sandstone/Panels";
import { Spottable } from "@enact/spotlight/Spottable"; 
import SpotlightContainerDecorator from "@enact/spotlight/SpotlightContainerDecorator";
import SpotlightRootDecorator from "@enact/spotlight/SpotlightRootDecorator";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // react-router-dom 가져오기
import Flowcheck from "../components/Flowcheck"; // Flowcheck 컴포넌트 가져오기
import Community from "../components/Community"; // Community 컴포넌트 가져오기

// 기존 Routes 안에 새로운 Route 추가
import VideoStream from "../components/VideoStream"; // Community 컴포넌트 가져오기
import Overview from "../components/Overview"; // Overview 컴포넌트 가져오기
import Control from "../components/Control"; // Control 컴포넌트 가져오기
import FloatingButton from "../components/FloatingButton"; // 플로팅 버튼 임포트
import logo from "../assets/logo.png"; // 로고 이미지 추가
import css from "../App/App.module.less";

// Spottable을 적용한 버튼
const SpottableButton = Spottable(Link); // Link 컴포넌트를 SpottableButton으로 만듭니다.
// NOTE: Link에 포커스(Spotlight) 기능을 추가한 커스텀 버튼 컴포넌트 -> 리모콘, 키보드로 포커스 이동 가능
// Link : react-router-dom의 Link 컴포넌트
// Spottable : Enact에서 제공하는 고차 컴포넌트(HOC) -> 컴포넌트를 인자로 받아서 새로운 컴포넌트 반환하는 함수

// 네비게이션 컨테이너
const Nav = SpotlightContainerDecorator("nav");
// NOTE: nav 태그에 포커스 이동이 가능한 컨테이너 기능 추가
// nav : HTML5의 기본 <nav> 태그
// Enact의 Spotlight는 키보드나 리모컨으로 포커스를 이동할 수 있는 시스템.
// SpotlightContainerDecorator로 감싸면 이 영역 내에서 포커스가 자동으로 관리됨

// NOTE: MainPanel이라는 이름의 컴포넌트 생성
// kind()는 Enact에서 컴포넌트 만들 때 쓰는 함수
const MainPanel = kind({ 
  name: "MainPanel",

  styles: { // NOTE: 스타일 설정 부분, "../App/App.module.less"에서 css 가져옴
    css,
    className: "app", // NOTE: 컴포넌트에 app이라는 클래스 이름 자동으로 붙여줌
  },

  render: (props) => {  
    return (
      // *NOTE: JSX 사용, JSX = JavaScript XML
      <Router> {/* NOTE: Router란? SPA(싱글 페이지 앱 구조)에서 페이지 이동(라우팅)을 관리하는 컴포넌트 */}
        <div {...props} className={css.scrollContainer}> {/*NOTE: scrollContainer라는 스타일이 적용된 전체 레이아웃을 잡는 div, 부모로부터 props 전달 받음*/}
          {/* 왼쪽 네비게이션 바와 오른쪽 콘텐츠 영역 */}
          <div style={{ display: "flex", height: "100vh" }}> {/* 좌우 레이아웃을 만들기 위해 flex 사용*/}
            {/* 왼쪽 네비게이션 바 */}
            <Nav className={css.navBar}>
              {/* 로고 이미지 추가 */}
              <div className={css.logoContainer}>
                <img src={logo} alt="PLKIT Logo" className={css.logo} />
              </div>

              {/*NOTE: 특정 라우트로 이동하는 네비 버튼*/}
              {/* 라우팅을 위한 Link로 변경 */}
              <SpottableButton to="/" className={css.navButton}>
                Overview
              </SpottableButton>
              <SpottableButton to="/control" className={css.navButton}>
                Control
              </SpottableButton>
              <SpottableButton to="/VideoStream" className={css.navButton}>
                VideoStream
              </SpottableButton>
              <SpottableButton to="/Flowcheck" className={css.navButton}>
                Flow Check
              </SpottableButton>
              <SpottableButton to="/Community" className={css.navButton}>
                Community
              </SpottableButton>
            </Nav>

            {/* 오른쪽 콘텐츠 영역 */}
            {/*NOTE: 이 영역에서 페이지가 바뀌면서 렌더링 됨*/}
            <div className={css.contentArea}>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/control" element={<Control />} />
                <Route path="/VideoStream" element={<VideoStream />} />
                <Route path="/Flowcheck" element={<Flowcheck />} />
                <Route path="/Community" element={<Community />} />
              </Routes>
            </div>
          </div>

          {/* 플로팅 버튼 */}
          {/*NOTE: 항상 떠있는 액션 버튼*/}
          <FloatingButton />
        </div>
      </Router>
    );
  },
});

//NOTE: MainPanel을 감싸는 HOC.
//ThemeDecorator : Sandstone 테마 전체 적용
//SpotlightRootDecorator : 이 앱을 Spotlight의 루트로 지정 -> 포커스가 전체 앱에서 동작하게끔
export default SpotlightRootDecorator(ThemeDecorator(MainPanel));

/*NOTE: 정리하자면?
	•	좌측: 네비 메뉴
	•	우측: 라우팅된 페이지
	•	플로팅: 부가 액션 버튼
	•	Router + Spotlight + Theme로 감싸져 있음
*/