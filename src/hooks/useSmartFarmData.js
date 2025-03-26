import { useState, useEffect, useRef } from "react";
import mqtt from "mqtt"; // mqtt 라이브러리 추가
import Overview from "../components/Overview";
import Control from "../components/Control";

const useSmartFarmData = () => {
  const [data, setData] = useState({
    // NOTE: 센서/예측 데이터 상태
    tempHumData: null,
    waterLevelData: null,
    illuminationData: null,
    tdsData: null,
    liquidTempData: null,
    predictionData: null,
  });

  // NOTE: 장치 상태 및 탱크 수위
  const [fan, setFan] = useState(false);
  const [heater, setHeater] = useState(false);
  const [ledLight, setLedLight] = useState(false);
  const [tank1, setTank1] = useState(50);
  const [tank2, setTank2] = useState(50);
  const [tank3, setTank3] = useState(50);
  const [tank4, setTank4] = useState(50);
  const [waterLevel, setWaterLevel] = useState(0);

  // mqttClient를 useRef로 선언
  // NOTE: 컴포넌트 리렌더링과 무관하게 유지
  const mqttClient = useRef(null);

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // NOTE: 1. 초기 데이터를 백엔드에서 fetch로 받아옴
    // 데이터를 서버로부터 불러오는 함수
    const fetchData = async () => {
      try {
        // NOTE: 각각의 센서 API에서 JSON 데이터 받아오기
        const tempHumResponse = await fetch(
          `http://${baseURL}/dummy/status/temp_hum`
        );
        const tempHumData = await tempHumResponse.json();

        const waterLevelResponse = await fetch(
          `http://${baseURL}/dummy/status/water_level`
        );
        const waterLevelData = await waterLevelResponse.json();

        const illuminationResponse = await fetch(
          `http://${baseURL}/dummy/status/illumination`
        );
        const illuminationData = await illuminationResponse.json();

        const tdsResponse = await fetch(`http://${baseURL}/dummy/status/tds`);
        const tdsData = await tdsResponse.json();

        const liquidTempResponse = await fetch(
          `http://${baseURL}/dummy/status/liquid_temp`
        );
        const liquidTempData = await liquidTempResponse.json();

        const predictionResponse = await fetch(
          `http://${baseURL}/dummy/status/prediction`
        );
        const predictionData = await predictionResponse.json();

        // NOTE: 전체 데이터를 setData에 저장
        setData({
          tempHumData,
          waterLevelData,
          illuminationData,
          tdsData,
          liquidTempData,
          predictionData,
        });
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    // NOTE: 2. MQTT 연결 설정
    // MQTT 설정
    mqttClient.current = mqtt.connect({
      host: process.env.REACT_APP_MQTT_HOST,
      port: parseInt(process.env.REACT_APP_MQTT_PORT, 10),
      protocol: process.env.REACT_APP_MQTT_PROTOCOL,
    });

    console.log(process.env.REACT_APP_MQTT_HOST);
    console.log(process.env.REACT_APP_MQTT_PORT);
    console.log(process.env.REACT_APP_MQTT_PROTOCOL);

    // NOTE: MQTT 수신 처리 함수 정의
    const handleMqttMessage = (topic, message) => {
      const msg = message.toString();
      // MQTT 메시지 처리 로직

      try {
        // MQTT 메시지 처리 로직
        const parsedMsg = JSON.parse(msg); // 메시지를 JSON 형식으로 파싱

        // NOTE: 센서 데이터 전체 수신 -> 통째로 setData 갱신
        if (topic === "PLKIT/overview") {
          const receivedData = JSON.parse(msg);
          setData(receivedData);
        } 
        
        // NOTE: 장치 제어 관련 메시지 처리
        else if (topic === "PLKIT/control/fan") {
          setFan(parsedMsg.command === "on");
        } else if (topic === "PLKIT/control/heater") {
          setHeater(parsedMsg.command === "on");
        } else if (topic === "PLKIT/control/Light") {
          setLedLight(parsedMsg.command === "on");
        } 
        
        // NOTE: 각 탱크 수위 및 물 수위
        else if (topic === "PLKIT/control/nutreinet_solution_pump_FE") {
          setTank1(Number(msg)); // 01: nutrient solution
        } else if (topic === "PLKIT/control/Plus_water_pump_FE") {
          setTank2(Number(msg)); // 02: water plus (water)
        } else if (topic === "PLKIT/control/farm_pump_FE") {
          setTank3(Number(msg)); // 03: farm
        } else if (topic === "PLKIT/control/recycle_pump_FE") {
          setTank4(Number(msg)); // 04: recycle fluid
        } else if (topic === "PLKIT/control/Water_level_FE") {
          setWaterLevel(Number(msg));
        }
      } catch (error) {
        console.error("Failed to parse MQTT message:", error);
      }
    };

    // NOTE: 4. MQTT 연결 시 필요한 주제들 구독
    // MQTT 연결 설정
    mqttClient.current.on("connect", () => {
      console.log("MQTT Broker에 연결됨");
      mqttClient.current.subscribe("PLKIT/overview", (err) => {
        if (!err) {
          console.log("PLKIT/overview 구독됨");
        }
      });

      mqttClient.current.subscribe("PLKIT/control/fan", (err) => {
        if (!err) {
          console.log("PLKIT/control/fan 구독됨");
        }
      });

      mqttClient.current.subscribe("PLKIT/control/heater", (err) => {
        if (!err) {
          console.log("PLKIT/control/heater 구독됨");
        }
      });

      mqttClient.current.subscribe("PLKIT/control/Light", (err) => {
        if (!err) {
          console.log("PLKIT/control/Light 구독됨");
        }
      });
      // 탱크 및 수위 관련 MQTT 주제 구독
      mqttClient.current.subscribe(
        "PLKIT/control/nutreinet_solution_pump_FE",
        (err) => {
          if (!err) {
            console.log("PLKIT/control/nutreinet_solution_pump_FE 구독됨");
          } else {
            console.error(
              "PLKIT/control/nutreinet_solution_pump_FE 구독 실패:",
              err
            );
          }
        }
      );

      mqttClient.current.subscribe(
        "PLKIT/control/Plus_water_pump_FE",
        (err) => {
          if (!err) {
            console.log("PLKIT/control/Plus_water_pump_FE 구독됨");
          } else {
            console.error("PLKIT/control/Plus_water_pump_FE 구독 실패:", err);
          }
        }
      );

      mqttClient.current.subscribe("PLKIT/control/farm_pump_FE", (err) => {
        if (!err) {
          console.log("PLKIT/control/farm_pump_FE 구독됨");
        } else {
          console.error("PLKIT/control/farm_pump_FE 구독 실패:", err);
        }
      });

      mqttClient.current.subscribe("PLKIT/control/recycle_pump_FE", (err) => {
        if (!err) {
          console.log("PLKIT/control/recycle_pump_FE 구독됨");
        } else {
          console.error("PLKIT/control/recycle_pump_FE 구독 실패:", err);
        }
      });

      mqttClient.current.subscribe("PLKIT/control/Water_level_FE", (err) => {
        if (!err) {
          console.log("PLKIT/control/Water_level_FE 구독됨");
        } else {
          console.error("PLKIT/control/Water_level_FE 구독 실패:", err);
        }
      });
    });

    mqttClient.current.on("error", (err) => {
      console.error("MQTT Broker 연결 실패:", err);
    });

    // NOTE: 메시지 수신 처리 연결
    mqttClient.current.on("message", (topic, message) => {
      console.log(`주제 ${topic}에서 메시지 수신: ${message.toString()}`);
      handleMqttMessage(topic, message);
    });

    // NOTE: 최초 fetch 실행
    fetchData();

    // NOTE: cleanup 함수 : 컴포넌트 unmount 시 MQTT 연결 해제
    return () => {
      mqttClient.current.end(); // MQTT 연결 해제
    };
  }, []);

  // NOTE: 외부에서 호출 가능한 제어 함수들
  // 물탱크 수위, 팬, 히터 등의 상태 변화를 MQTT를 통해 전송
  const toggleFan = () => {
    const newState = !fan;
    setFan(newState);
    console.log("Fan state:", newState); // 팬 상태 로그
    const command = newState ? { command: "on" } : { command: "off" };
    mqttClient.current.publish("PLKIT/control/fan", JSON.stringify(command));
  };

  const toggleHeater = () => {
    const newState = !heater;
    setHeater(newState);
    console.log("Heater:", newState); // 팬 상태 로그

    const command = newState ? { command: "on" } : { command: "off" };
    mqttClient.current.publish("PLKIT/control/heater", JSON.stringify(command));
  };

  const toggleLedLight = () => {
    const newState = !ledLight;
    setLedLight(newState);
    console.log("Led Light:", newState); // 팬 상태 로그

    const command = newState ? { command: "on" } : { command: "off" };
    mqttClient.current.publish("PLKIT/control/Light", JSON.stringify(command));
  };

  const handleTankChange = (tankNumber, value) => {
    if (tankNumber === 1) {
      setTank1(value);
      console.log("Tank 1 level:", value); // tank1 상태 로그

      mqttClient.current.publish(
        "PLKIT/control/nutreinet_solution_pump_FE",
        value.toString()
      );
    } else if (tankNumber === 2) {
      setTank2(value);
      console.log("Tank 2 level:", value); // tank2 상태 로그

      mqttClient.current.publish(
        "PLKIT/control/Plus_water_pump_FE",
        value.toString()
      );
    } else if (tankNumber === 3) {
      setTank3(value);
      console.log("Tank 3 level:", value); // tank3 상태 로그

      mqttClient.current.publish(
        "PLKIT/control/farm_pump_FE",
        value.toString()
      );
    } else if (tankNumber === 4) {
      setTank4(value);
      console.log("Tank 4 level:", value); // tank4 상태 로그
      mqttClient.current.publish(
        "PLKIT/control/recycle_pump_FE",
        value.toString()
      );
    }
  };

  const handleWaterLevelChange = (level) => {
    // 입력값이 0~100 사이인지 확인하고 값 제한
    if (level < 0) {
      level = 0;
    } else if (level >= 100) {
      level = 100;
    }
    setWaterLevel(level);
    console.log("Water Level:", level); // water level 상태 로그
    mqttClient.current.publish(
      "PLKIT/control/Water_level_FE",
      level.toString()
    );
  };

  // NOTE: 외부에서 사용할 수 있도록 값과 함수 export
  return {
    data,
    fan,
    heater,
    ledLight,
    tank1,
    tank2,
    tank3,
    tank4,
    waterLevel,
    toggleFan,
    toggleHeater,
    toggleLedLight,
    handleTankChange,
    handleWaterLevelChange,
    setTank1, // 추가
    setTank2, // 추가
    setTank3, // 추가
    setTank4, // 추가
    setWaterLevel, // 추가
  };
};

export default useSmartFarmData;
