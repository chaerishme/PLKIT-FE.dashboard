// NOTE: Enact에서 제공하는 kind() 유틸리티 import
// Community.js
import kind from "@enact/core/kind";

// NOTE: Community 컴포넌트 정의
const Community = kind({
  name: "Community",  // NOTE: 컴포넌트 이름 설정

  render: (props) => {
    return (
      // NOTE: 외부 웹사이트를 임베딩할 컨테이너 div
      <div style={{ width: "100%", height: "100%" }}>
        <iframe
          src="https://test-chi-three-99.vercel.app/" // 원하는 링크로 변경하세요
          style={{ width: "100%", height: "100%", border: "none" }} // NOTE: iframe도 화면을 100% 채우도록 설정
        />
      </div>
    );
  },
});

// NOTE: 별도 데코레이터 없이 바로 export
export default Community;

// NOTE: iframe이란? inline frame. 외부 웹페이지를 현재 페이지 안에 창처럼 삽입하는 HTML 태그