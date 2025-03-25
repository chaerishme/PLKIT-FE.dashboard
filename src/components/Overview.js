import React, { useRef, useState } from "react";  // NOTE: useRef, useState 훅 사용 : 컴포넌트 상태, 차트 DOM 접근용 ref 생성
import { Heading } from "@enact/sandstone/Heading"; // NOTE: Enact 기반의 UI 컴포넌트 (Layout + Cell + Heading) 사ㅛ용
import { Layout } from "@enact/ui/Layout";
import { Cell as EnactCell } from "@enact/ui/Layout";
import { Cell as RechartsCell } from "recharts";
import useSmartFarmData from "../hooks/useSmartFarmData"; // NOTE: 스마트팜 데이터 가져오는 커스텀 훅
import FloatingButton from "./FloatingButton"; // 모달리스 버튼 가져오기

// NOTE: Recharts 라이브러리로 다양한 데이터 시각화 차트 구현
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import styles from "../App/App.module.less"; // CSS를 module 형식으로 변경

// 테이블 컴포넌트 임포트
import TempHumTable from "./TempHumTable";
import WaterLevelTable from "./WaterLevelTable";
import IlluminationTable from "./IlluminationTable";
import TdsTable from "./TdsTable";
import LiquidTempTable from "./LiquidTempTable";
import PredictionTable from "./PredictionTable";

// 유틸리티 함수 임포트
//import { saveChartAsPDF, saveChartAsWord } from "../utils/exportChart";

// === Overview 컴포넌트 ===
const Overview = () => {
  // useState를 컴포넌트 최상위에서 호출 
  const [tempHumSlide, setTempHumSlide] = useState(0);  // NOTE: 컴포넌트 내부 상태 정의, 온습도 데이터 슬라이드하면서 넘길 때 사용
  const [illuminationSlide, setIlluminationSlide] = useState(0); 
  const [tdsSlide, setTdsSlide] = useState(0);
  const [liquidTempSlide, setLiquidTempSlide] = useState(0);

  // 각 차트의 뷰 모드 상태 관리 ('chart' 또는 'table')
  // NOTE: chart <-> table 전환을 위한 상태 값: 초기엔 chart로 시작, 클릭하면 table로 토글
  // NOTE: 차트 export나 DOM 조작을 위한 ref 생성
  const [viewModes, setViewModes] = useState({
    tempHumData: "chart",
    waterLevelData: "chart",
    illuminationData: "chart",
    tdsData: "chart",
    liquidTempData: "chart",
    predictionData: "chart",
  });

  // 뷰 모드 토글 함수
  const toggleViewMode = (key) => {
    setViewModes((prevModes) => ({
      ...prevModes,
      [key]: prevModes[key] === "chart" ? "table" : "chart",
    }));
  };

  // 차트에 대한 ref 생성
  const tempHumChartRef = useRef(null); // NOTE: 차트를 pdf로 내보낼 때 DOM에 직접 접근하기 위한 ref
  const waterLevelChartRef = useRef(null);
  const illuminationChartRef = useRef(null);
  const tdsChartRef = useRef(null);
  const liquidTempChartRef = useRef(null);
  const predictionChartRef = useRef(null);

  // NOTE: 커스텀 훅으로 스마트팜 데이터 불러옴
  const { data } = useSmartFarmData(); 

  if ( // NOTE: 데이터 로딩 상태 처리
    !data ||
    !data.tempHumData ||
    !data.waterLevelData ||
    !data.illuminationData ||
    !data.tdsData ||
    !data.liquidTempData ||
    !data.predictionData
  ) {
    return <div>Loading...</div>;
  }

  const {
    tempHumData,
    waterLevelData,
    illuminationData,
    tdsData,
    liquidTempData,
    predictionData,
  } = data;

  // 데이터를 10개씩 나누기 위한 함수
  // NOTE: 데이터가 많을 경우 슬라이드로 10개씩 나눠서 보여주기 위한 로직
  const chunkedData = (data, size) => {
    const result = [];
    for (let i = 0; i < data.length; i += size) {
      result.push(data.slice(i, i + size));
    }
    return result;
  };

  // 슬라이드로 표시할 데이터 나누기 (10개씩)
  const tempHumDataChunks = chunkedData(tempHumData, 3);
  const illuminationDataChunks = chunkedData(illuminationData, 10);
  const tdsDataChunks = chunkedData(tdsData, 10);
  const liquidTempDataChunks = chunkedData(liquidTempData, 10);

  // 각 슬라이드 이전/다음으로 이동하는 함수
  const prevSlide = (slide, setSlide, dataChunks) => {
    if (slide > 0) setSlide(slide - 1);
  };

  const nextSlide = (slide, setSlide, dataChunks) => {
    if (slide < dataChunks.length - 1) setSlide(slide + 1);
  };

  //  NOTE: 예측 데이터의 최신 값 가져오기
  const latestData = predictionData[predictionData.length - 1];
  const latestIndex = predictionData.length - 1;

  return (
    <div className="Overview">
      {/* === 대시보드 레이아웃 === */}
      <h1>&nbsp;&nbsp; Overview</h1>
      {/*NOTE: 렌더링 구조. 각각의 Cell 안에서 데이터 시각화 또는 테이블 형태로 토글 가능. Next/Prev로 화면 넘김 가능. 고정된 액션 버튼 출력*/}
      <Layout orientation="vertical" className={styles.dashboard}>
        {/* 온도 및 습도 */}
        <EnactCell>
          <div onClick={() => toggleViewMode("tempHumData")}>
            <Heading showLine>Farm Air Temperature and Humidity</Heading>
          </div>
          {viewModes.tempHumData === "chart" ? (
            <>
              <div ref={tempHumChartRef}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={tempHumDataChunks[tempHumSlide]}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <CartesianGrid stroke="#ccc" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temp"
                      stroke="#8884d8"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="hum"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* 저장 버튼 
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveChartAsPDF(tempHumChartRef, "Temperature and Humidity");
                }}
              >
                Save as PDF
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveChartAsWord(tempHumChartRef, "Temperature and Humidity");
                }}
              >
                Save as Word
              </button>*/}
              {/* 슬라이드 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide(tempHumSlide, setTempHumSlide);
                }}
                disabled={tempHumSlide === 0}
              >
                Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide(tempHumSlide, setTempHumSlide, tempHumDataChunks);
                }}
                disabled={tempHumSlide === tempHumDataChunks.length - 1}
              >
                Next
              </button>
            </>
          ) : (
            <TempHumTable data={tempHumData} />
          )}
        </EnactCell>

        <div className={styles.divider}></div>
        {/* 수위, 조도, TDS, 액체 온도, 예측 데이터도 동일한 패턴*/}
        {/* 수위 */}
        <EnactCell>
          <div onClick={() => toggleViewMode("waterLevelData")}>
            <Heading showLine>Water Level</Heading>
          </div>
          {viewModes.waterLevelData === "chart" ? (
            <div className={styles.waterLevel}>
              {waterLevelData.map((level, index) => (
                <div key={index} className={styles.waterLevelItem}>
                  <span>{level.name} (level) </span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${level.value}%` }}
                    ></div>
                  </div>
                  <span>{level.value}% Correct</span>
                </div>
              ))}
            </div>
          ) : (
            <WaterLevelTable data={waterLevelData} />
          )}
        </EnactCell>

        <div className={styles.divider}></div>

        {/* 조도 */}
        <EnactCell>
          <div onClick={() => toggleViewMode("illuminationData")}>
            <Heading showLine>Illumination</Heading>
          </div>
          {viewModes.illuminationData === "chart" ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={illuminationDataChunks[illuminationSlide]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="light" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide(illuminationSlide, setIlluminationSlide);
                }}
                disabled={illuminationSlide === 0}
              >
                Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide(
                    illuminationSlide,
                    setIlluminationSlide,
                    illuminationDataChunks
                  );
                }}
                disabled={
                  illuminationSlide === illuminationDataChunks.length - 1
                }
              >
                Next
              </button>
            </>
          ) : (
            <IlluminationTable data={illuminationData} />
          )}
        </EnactCell>

        <div className={styles.divider}></div>

        {/* TDS */}
        <EnactCell>
          <div onClick={() => toggleViewMode("tdsData")}>
            <Heading showLine>TDS</Heading>
          </div>
          {viewModes.tdsData === "chart" ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={tdsDataChunks[tdsSlide]}>
                  <XAxis dataKey="name" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tds" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide(tdsSlide, setTdsSlide);
                }}
                disabled={tdsSlide === 0}
              >
                Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide(tdsSlide, setTdsSlide, tdsDataChunks);
                }}
                disabled={tdsSlide === tdsDataChunks.length - 1}
              >
                Next
              </button>
            </>
          ) : (
            <TdsTable data={tdsData} />
          )}
        </EnactCell>

        <div className={styles.divider}></div>

        {/* 농장 액체 온도 */}
        <EnactCell>
          <div onClick={() => toggleViewMode("liquidTempData")}>
            <Heading showLine>Farm Liquid Temperature</Heading>
          </div>
          {viewModes.liquidTempData === "chart" ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={liquidTempDataChunks[liquidTempSlide]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temp" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide(liquidTempSlide, setLiquidTempSlide);
                }}
                disabled={liquidTempSlide === 0}
              >
                Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide(
                    liquidTempSlide,
                    setLiquidTempSlide,
                    liquidTempDataChunks
                  );
                }}
                disabled={liquidTempSlide === liquidTempDataChunks.length - 1}
              >
                Next
              </button>
            </>
          ) : (
            <LiquidTempTable data={liquidTempData} />
          )}
        </EnactCell>

        <div className={styles.divider}></div>

        {/* 예측 데이터 */}
        <EnactCell>
          <div onClick={() => toggleViewMode("predictionData")}>
            <Heading showLine>Water vs Nutrient</Heading>
          </div>
          {viewModes.predictionData === "chart" ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Water",
                        value: predictionData[latestIndex].water,
                      },
                      {
                        name: "Nutrient",
                        value: predictionData[latestIndex].nutrient,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  >
                    <RechartsCell key="cell-0" fill="#0088FE" />
                    <RechartsCell key="cell-1" fill="#FFBB28" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="card double-card" style={{ width: "100%" }}>
                <h3>Water and Nutrient Solution Prediction</h3>
                <div className={styles.chartContainer}>
                  <div className={styles.chartSection}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={predictionData}>
                        <XAxis
                          dataKey="name"
                          interval={0}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis />
                        <CartesianGrid stroke="#ccc" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="water" fill="#00C49F" />
                        <Bar dataKey="nutrient" fill="#FFBB28" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={styles.textSection}>
                    <p>
                      - Water는
                      <span>{latestData.water}일</span>
                      정도 사용 가능합니다!
                    </p>
                    <p>
                      - Nutrient는
                      <span className={styles.nutrientSpan}>
                        {latestData.nutrient}일
                      </span>
                      정도 사용 가능합니다!
                    </p>
                    <p>
                      - recycle은
                      <span className={styles.recycleSpan}>
                        {latestData.water}일
                      </span>
                      정도 사용 가능합니다!
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <PredictionTable data={predictionData} />
          )}
        </EnactCell>

        <div className={styles.divider}></div>
      </Layout>
      {/* === 하단 플로팅 버튼 === */}
      <FloatingButton />
    </div>
  );
};

export default Overview;
