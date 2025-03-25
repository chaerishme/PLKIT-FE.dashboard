/* global WebSocket */  // NOTE: WebSocket 전역 객체 사용 명시 (eslint 로고 방지)

import React, { useState, useEffect, useRef } from "react"; 
import { Heading } from "@enact/sandstone/Heading"; // NOTE: Enact 제목 컴포넌트
import { Layout, Cell } from "@enact/ui/Layout"; // NOTE: Enact 레이아웃 컴포넌트
import Image from "@enact/sandstone/Image"; // NOTE: Enact 이미지 컴포넌트
import css from "./VideoStream.module.less"; // NOTE: 스타일 모듈 import

// NOTE: 실시간 영상 스트리밍 컴포넌트
const VideoStream = () => {
  // NOTE: 이미지 URL 상태 관리 (WebSocket으로 받은 영상 blob)
  const [imageSrc, setImageSrc] = useState(null);

  // NOTE: 이전 blob URL 저장용 ref (메모리 누수 방지용)
  const previousImageUrl = useRef();

  // NOTE: WebSocket으로 실시간 영상 수신
  useEffect(() => {
    const ws = new WebSocket("ws://plkit.site/ws/video");  // 영상용 WebSocket 연결
    ws.binaryType = "blob"; // 영상은 blob으로 받음

    // NOTE: WebSocket 수신 이벤트
    ws.onmessage = (event) => {
      const blobUrl = URL.createObjectURL(event.data); // blob → blob URL로 변환
      setImageSrc(blobUrl); // 이미지로 렌더링

      // 이전 Blob URL 해제하여 메모리 누수 방지
      if (previousImageUrl.current) {
        URL.revokeObjectURL(previousImageUrl.current);
      }
      previousImageUrl.current = blobUrl;
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 해제 및 Blob URL 해제
    return () => {
      ws.close();
      if (previousImageUrl.current) {
        URL.revokeObjectURL(previousImageUrl.current);
      }
    };
  }, []);

  return (
    <Layout orientation="vertical" className={css.videoStream}>
      <Cell shrink>
        <Heading showLine>실시간 영상 스트리밍</Heading>
      </Cell>
      {/* 영상 스트리밍 영역 */}
      <Cell>
        <div className={css.imageContainer}>
          <Image src={imageSrc} alt="Video Stream" className={css.image} />
        </div>
      </Cell>
    </Layout>
  );
};

export default VideoStream;
