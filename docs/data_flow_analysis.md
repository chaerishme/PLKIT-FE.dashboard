### 데이터 흐름 분석
hooks/useSmartFarmData.js

스마트팜 데이터 통합 훅

센서 상태와 제어 상태를 관리하고, fetch와 MQTT 기반으로 데이터 주고 받음

```
fetch [초기 데이터 요청] + MQTT [실시간 데이터 수신]
                    ↓
useSmartFarmData 내부 상태로 저장
                    ↓
Overview 등 컴포넌트에 props로 전달
```

<br>

---

### 데이터 구조
```
const [data, setData] = useState({
  tempHumData: null,
  waterLevelData: null,
  illuminationData: null,
  tdsData: null,
  liquidTempData: null,
  predictionData: null,
}); -> Overview.js가 해당 data 받아서 사용
```
<br>


|항목|조절 방식|제어 함수|MQTT Topic|상태값|
|---|---|---|---|---|
|팬|버튼|toggleFan()|PLKIT/control/fan|fan|
|히터|버튼|toggleHeater()|PLKIT/control/heater|heater|
|LED 조명|버튼|toggleLedLight()|PLKIT/control/Light|ledLight|
|탱크 수위|슬라이더|handleTankChange()|탱크별 topic|tank1~4|
|물 수위|슬라이더|handleWaterLevelChange()|PLKIT/control/Water_level_FE|waterLevel|


<br>

---

<br>

### MQTT란?

초경량 메시지 통신 프로토콜

여기서는 팬/히터/LED 제어, 탱크 수위 실시간 표시, 전체 센서 데이터 수신에 쓰임

```
mqttClient.current.subscribe("PLKIT/control/fan");
// 이 주제의 변화를 듣고 있겠다 -> subscribe
// PLKIT/control/fan 은 데이터를 주고받는 채널 이름

mqttClient.current.on("message", (topic, message) => {
    // 메시지 수신 시 실행되어 반영
});

mqttClient.current.publish("PLKIT/control/fan", JSON.stringify(command));
// 사용자가 버튼을 클릭하면 메시지를 해당 topic에 전송

mqttClient.current.publish("PLKIT/control/fan", JSON.stringify(command));
// 슬라이더 조정 시 탱크 수위 변경 메시지 전송
```

``` 
사용자 입력 or 센서 데이터
   ↓
[ MQTT publish or subscribe ]
   ↓
useSmartFarmData에서 상태 업데이트
   ↓
Overview/Control 컴포넌트에 전달
   ↓
UI 반영
```