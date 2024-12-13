import React, { useState, useEffect, useCallback } from "react";
import useStore from "../../store";

const WaterCard = ({ min = 0, max = 100, step = 10 }) => {
  const { WaterBar, setWaterBar, basePath, date, getWaterScore } = useStore();
  const [clickedImages, setClickedImages] = useState(new Set());

  // 이미지 경로 생성 함수
  const getImagePath = useCallback(
    (fileName) => {
      return `${basePath}/${fileName}`;
    },
    [basePath]
  );

  // 이미지 상태 확인 함수
  const getImageStatus = useCallback(
    (index) => {
      return clickedImages.has(index) ? "on" : "off";
    },
    [clickedImages]
  );

  // 썸네일 이미지 선택 함수
  const getThumbImage = useCallback(() => {
    if (WaterBar >= 80) return "drink_4";
    if (WaterBar >= 60) return "drink_3";
    if (WaterBar >= 40) return "drink_2";
    if (WaterBar >= 20) return "drink_1";
    return "drink_0";
  }, [WaterBar]);

  // 날짜 변경 시 초기 데이터 로드
  useEffect(() => {
    const score = getWaterScore(date);
    setWaterBar(score);

    // 점수에 따른 초기 이미지 상태 설정
    const dropCount = Math.floor(score / 10);
    setClickedImages(
      new Set(Array.from({ length: dropCount }, (_, i) => i + 1))
    );
  }, [date, getWaterScore, setWaterBar]);

  // WaterBar 변경 핸들러
  const handleWaterBarChange = useCallback(
    (newValue) => {
      setWaterBar(newValue);
      const dropCount = Math.floor(newValue / 10);
      setClickedImages(
        new Set(Array.from({ length: dropCount }, (_, i) => i + 1))
      );
    },
    [setWaterBar]
  );

  // 이미지 클릭 핸들러
  const handleImageClick = useCallback(
    (index) => {
      setClickedImages((prev) => {
        const newClickedImages = new Set(prev);

        if (newClickedImages.has(index)) {
          newClickedImages.delete(index);
        } else if (newClickedImages.size < 10) {
          newClickedImages.add(index);
        }

        const newScore = newClickedImages.size * 10;
        setWaterBar(newScore);
        return newClickedImages;
      });
    },
    [setWaterBar]
  );

  // 날짜 포맷팅
  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="WaterCard">
      <p className="white">Water SCORE - {formattedDate}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={WaterBar}
        onChange={(e) => handleWaterBarChange(parseInt(e.target.value, 10))}
        className="Water-slider"
        data-thumb={getThumbImage()}
        style={{
          "--drink-0-bg-image": `url(${getImagePath("drink_0.png")})`,
          "--drink-1-bg-image": `url(${getImagePath("drink_1.png")})`,
          "--drink-2-bg-image": `url(${getImagePath("drink_2.png")})`,
          "--drink-3-bg-image": `url(${getImagePath("drink_3.png")})`,
          "--drink-4-bg-image": `url(${getImagePath("drink_4.png")})`,
        }}
      />
      <div className="Water-labels">
        <div className="Water-img">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              id={`drop_${index + 1}`}
              onClick={() => handleImageClick(index + 1)}
            >
              <img
                src={getImagePath(`Water_${getImageStatus(index + 1)}.png`)}
                width="30px"
                className={getImageStatus(index + 1) === "on" ? "fin" : ""}
                alt={`Water Drop ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaterCard;
