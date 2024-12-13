import { create } from "zustand";

const API_KEY = "9f53add88a37ef9d5289abbbba6e6f8b";

// 유틸리티 함수들
const checkIsMobile = () => window.innerWidth <= 800;

const getBasePath = () => {
  if (typeof window !== "undefined") {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    return pathSegments.length > 0 ? `/${pathSegments[0]}` : "";
  }
  return "";
};

// YYYYMMDD 형식으로 날짜 변환
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const useStore = create((set, get) => ({
  // 기본 상태
  User: localStorage.getItem("User") || "Guest",
  date: new Date(),
  WaterBar:
    Number(localStorage.getItem(`${formatDate(new Date())}-Water`)) || 0,
  currentTime: new Date(),
  basePath: getBasePath(),
  isMobile: checkIsMobile(),

  // 날씨 상태
  temperature: {
    current: null,
    low: null,
    high: null,
    location: "",
  },

  // 기본 액션들
  updateBasePath: () => set({ basePath: getBasePath() }),

  updateIsMobile: () => {
    set({ isMobile: checkIsMobile() });
  },

  updateCurrentTime: () => {
    set({ currentTime: new Date() });
  },

  // Todo 관련 액션들
  setList: (newText) => {
    set((state) => {
      const dateKey = formatDate(state.date);
      const currentList = JSON.parse(localStorage.getItem(dateKey) || "[]");
      const newItem = { text: newText, checked: false };
      const updatedList = [...currentList, newItem];

      localStorage.setItem(dateKey, JSON.stringify(updatedList));
      return { date: state.date };
    });
  },

  delList: (index) => {
    set((state) => {
      const dateKey = formatDate(state.date);
      const currentList = JSON.parse(localStorage.getItem(dateKey) || "[]");
      const updatedList = currentList.filter((_, i) => i !== index);

      localStorage.setItem(dateKey, JSON.stringify(updatedList));
      return { date: state.date };
    });
  },

  toggleCheck: (index) => {
    set((state) => {
      const dateKey = formatDate(state.date);
      const currentList = JSON.parse(localStorage.getItem(dateKey) || "[]");
      const updatedList = currentList.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      );

      localStorage.setItem(dateKey, JSON.stringify(updatedList));
      return { date: state.date };
    });
  },

  // 현재 선택된 날짜의 할일 목록 가져오기
  getCurrentTodos: () => {
    const dateKey = formatDate(get().date);
    return JSON.parse(localStorage.getItem(dateKey) || "[]");
  },

  // 사용자 관련 액션들
  setUser: (newUser) => {
    localStorage.setItem("User", newUser);
    set({ User: newUser });
  },

  setDate: (newDate) => {
    const formattedDate = formatDate(newDate);
    const savedWaterScore =
      Number(localStorage.getItem(`${formattedDate}-Water`)) || 0;
    set({
      date: new Date(newDate),
      WaterBar: savedWaterScore,
    });
  },

  // 워터바 관련 액션들
  setWaterBar: (Water) => {
    const dateKey = `${formatDate(get().date)}-Water`;
    localStorage.setItem(dateKey, Water.toString());
    set({ WaterBar: Water });
  },

  getWaterScore: (date) => {
    const dateKey = `${formatDate(date)}-Water`;
    return Number(localStorage.getItem(dateKey)) || 0;
  },

  startWaterBar: () => {
    const interval = setInterval(() => {
      set((state) => {
        if (state.WaterBar < 100) {
          const newValue = state.WaterBar + 10;
          const dateKey = `${formatDate(state.date)}-Water`;
          localStorage.setItem(dateKey, newValue.toString());
          return { WaterBar: newValue };
        } else {
          clearInterval(interval);
          return state;
        }
      });
    }, 100);
  },

  // 날씨 관련 액션들
  initWeather: async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });

        const { latitude, longitude } = position.coords;
        localStorage.setItem("coords", JSON.stringify({ latitude, longitude }));

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Weather API response was not ok");
        }

        const data = await response.json();

        set({
          temperature: {
            current: Math.round(data.main.temp * 10) / 10,
            low: Math.round(data.main.temp_min * 10) / 10,
            high: Math.round(data.main.temp_max * 10) / 10,
            location: data.name,
          },
        });
      } catch (error) {
        console.error("Weather fetch failed:", error);
        set({
          temperature: {
            current: null,
            low: null,
            high: null,
            location: "Location access denied",
          },
        });
      }
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  },
}));

// 윈도우 리사이즈 이벤트 리스너
if (typeof window !== "undefined") {
  window.addEventListener("resize", useStore.getState().updateIsMobile);
}

export default useStore;
