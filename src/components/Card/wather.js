import React, { useState, useEffect } from "react";
import useStore from "../../store";

const WatherCard = ({ min = 0, max = 100, step = 10 }) => {
  const { watherBar, setwatherBar, basePath, date, getWatherScore } =
    useStore();
  const [clickedImages, setClickedImages] = useState(new Set());

  // 컴포넌트 마운트 시 해당 날짜의 점수 불러오기
  useEffect(() => {
    const score = getWatherScore(date);
    setwatherBar(score);

    // 클릭된 이미지 상태 복원
    const dropCount = Math.floor(score / 10);
    const newClickedImages = new Set();
    for (let i = 1; i <= dropCount; i++) {
      newClickedImages.add(i);
    }
    setClickedImages(newClickedImages);
  }, [date]); // date가 변경될 때마다 실행

  const getImagePath = (fileName) => {
    return `${basePath}/${fileName}`;
  };

  const getImageStatus = (index) => {
    return clickedImages.has(index) ? "on" : "off";
  };

  const handleImageClick = (index) => {
    const newClickedImages = new Set(clickedImages);

    if (newClickedImages.has(index)) {
      newClickedImages.delete(index);
    } else {
      if (newClickedImages.size < 10) {
        newClickedImages.add(index);
      }
    }

    const newScore = newClickedImages.size * 10;
    setClickedImages(newClickedImages);
    setwatherBar(newScore);
  };

  const getThumbImage = () => {
    if (watherBar >= 80) return "drink_4";
    if (watherBar >= 60) return "drink_3";
    if (watherBar >= 40) return "drink_2";
    if (watherBar >= 20) return "drink_1";
    return "drink_0";
  };

  useEffect(() => {
    const dropCount = Math.floor(watherBar / 10);
    const currentActive = Array.from(clickedImages);
    const newClickedImages = new Set();

    for (let i = 0; i < dropCount; i++) {
      if (i < currentActive.length) {
        newClickedImages.add(currentActive[i]);
      } else {
        for (let j = 1; j <= 10; j++) {
          if (!newClickedImages.has(j)) {
            newClickedImages.add(j);
            break;
          }
        }
      }
    }

    setClickedImages(newClickedImages);
  }, [watherBar]);

  // 현재 날짜 표시
  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="WatherCard">
      <p className="white">WATER SCORE - {formattedDate}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={watherBar}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          setwatherBar(newValue);
        }}
        className="wather-slider"
        data-thumb={getThumbImage()}
        style={{
          "--drink-0-bg-image": `url(${getImagePath("drink_0.png")})`,
          "--drink-1-bg-image": `url(${getImagePath("drink_1.png")})`,
          "--drink-2-bg-image": `url(${getImagePath("drink_2.png")})`,
          "--drink-3-bg-image": `url(${getImagePath("drink_3.png")})`,
          "--drink-4-bg-image": `url(${getImagePath("drink_4.png")})`,
        }}
      />
      <div className="wather-labels">
        <div className="water-img">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              id={`drop_${index + 1}`}
              onClick={() => handleImageClick(index + 1)}
            >
              <img
                src={getImagePath(`water_${getImageStatus(index + 1)}.png`)}
                width="30px"
                className={getImageStatus(index + 1) === "on" ? "fin" : ""}
                alt={`drop_${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatherCard;
