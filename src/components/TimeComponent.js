import React, { useEffect } from "react";
import useStore from "../store";

const TimeComponent = () => {
  const { currentTime, temperature, updateCurrentTime, initWeather, isMobile } =
    useStore();

  useEffect(() => {
    // 초기 데이터 로드
    initWeather();
    updateCurrentTime();

    // 주기적 업데이트 설정
    const timeInterval = setInterval(updateCurrentTime, 1000);
    const weatherInterval = setInterval(initWeather, 1800000); // 30분마다 날씨 업데이트

    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, [initWeather, updateCurrentTime]);

  const formatTime = (date) => {
    if (!date) return "00:00:00";

    try {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "00:00:00";
    }
  };

  return (
    <div className={`${isMobile ? "mtime-container" : "time-container"}`}>
      <div className="time">{formatTime(currentTime)}</div>
      <div className="temperature-info">
        {temperature.current !== null && (
          <>
            <span>PRESENT: {temperature.current}°C</span>
            <span>
              LOW: {temperature.low}°C / HIGH: {temperature.high}°C
            </span>
            <span>@ {temperature.location}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeComponent;
