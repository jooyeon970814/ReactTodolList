import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { Reset } from "styled-reset";
import Calendar from "./components/Calendar";
import UserCard from "./components/Card/user";
import PictureCard from "./components/Card/picture";
import useStore from "./store";
import WatherCard from "./components/Card/wather";
import TodolistCard from "./components/Card/todolist";
import "./styles/style.css";
import "./styles/root.css";
import TimeComponent from "./components/TimeComponent";

// useInterval 커스텀 훅
const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const tick = () => {
      savedCallback.current();
    };
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

// 배경 이미지 로드 커스텀 훅
const useBackgroundImage = (initialDelay, intervalDelay) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [bgImage, setBgImage] = useState(
    "https://picsum.photos/seed/0/1920/1080"
  ); // 기본값을 빈 문자열로 설정

  const loadNewImage = () => {
    const random = Math.floor(Math.random() * 100) + 1;
    const url = `https://picsum.photos/seed/${random}/1920/1200`;
    const img = new Image();
    img.src = url;

    img.onload = () => {
      setImageLoaded(true);
      setTimeout(() => {
        setBgImage(img.src); // 1초 후에 bgImage 상태 변경
      }, 1000);
    };
  };

  // 초기 딜레이 후 첫 이미지 로드
  useEffect(() => {
    const timer = setTimeout(() => {
      loadNewImage();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  // 주기적인 이미지 로딩
  useInterval(loadNewImage, intervalDelay);
  document.body.style.transition = "background-image 1s ease-in-out";
  document.body.style.backgroundImage = `url(${bgImage})`;
  return { imageLoaded, bgImage };
};

export const App = () => {
  const { date, progress, setDate, startWaterProgress, isMobile } = useStore();

  // useBackgroundImage 커스텀 훅 사용
  const { imageLoaded, bgImage } = useBackgroundImage(0, 4000);

  useEffect(() => {
    Modal.setAppElement("#root");
    if (progress < 100) {
      startWaterProgress();
    }
  }, [progress, startWaterProgress]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return !imageLoaded ? (
    // 이미지가 로드되지 않았으면 로딩 스피너를 보여줍니다.
    <div className="loading-spinner">Loading...</div>
  ) : (
    <div className="App">
      <Reset />
      <main className={`${isMobile ? "msidebar" : "sidebar"}`}>
        <div className={`${isMobile ? "mcard-container" : "card-container"}`}>
          <div>
            <TimeComponent />
          </div>
          <div className="flex gap-10">
            <UserCard />
            <PictureCard url={bgImage} /> {/* 배경 이미지가 로드되면 전달 */}
          </div>
          <WatherCard min={0} max={100} value={progress} />
          <Calendar currentDate={date} onDateChange={handleDateChange} />
          <TodolistCard />
        </div>
      </main>
    </div>
  );
};

export default App;
