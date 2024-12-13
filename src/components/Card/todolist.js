import React, { useState, useEffect } from "react";
import useStore from "../../store";

const TodolistCard = () => {
  const { User, date, setList, delList, toggleCheck } = useStore();
  const [InputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  // 날짜를 YYYYMMDD 형식으로 변환
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  // 현재 날짜의 할일 목록 가져오기
  useEffect(() => {
    const dateKey = formatDate(date);
    const currentTodos = JSON.parse(localStorage.getItem(dateKey) || "[]");
    setTodos(currentTodos);
  }, [date]); // date가 변경될 때마다 todos 업데이트

  const Submit = (event) => {
    event.preventDefault();
    if (InputValue.trim()) {
      setList(InputValue);
      // Todo 추가 후 현재 목록 다시 불러오기
      const dateKey = formatDate(date);
      const updatedTodos = JSON.parse(localStorage.getItem(dateKey) || "[]");
      setTodos(updatedTodos);
      setInputValue("");
    }
  };

  const InputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleDelete = (index) => {
    delList(index);
    // 삭제 후 현재 목록 다시 불러오기
    const dateKey = formatDate(date);
    const updatedTodos = JSON.parse(localStorage.getItem(dateKey) || "[]");
    setTodos(updatedTodos);
  };

  const handleToggle = (index) => {
    toggleCheck(index);
    // 토글 후 현재 목록 다시 불러오기
    const dateKey = formatDate(date);
    const updatedTodos = JSON.parse(localStorage.getItem(dateKey) || "[]");
    setTodos(updatedTodos);
  };

  // 날짜 표시 형식 설정
  const formatDisplayDate = (date) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="todoListCard">
      <div className="line-h25">
        <div>
          <p className="state f-s">
            <span className="list">●</span> on going{" "}
            <span className="list">|</span>
            <span className="list yellow">●</span> finished
          </p>
          <h3 className="h-3">TO-DO LIST</h3>
          <p className="f-s m-b2 f-c">{formatDisplayDate(date)}</p>
        </div>
        {User === "Guest" ? (
          <>
            <p className="f-b f-s white">{User}님, 안녕하세요.</p>
            <p className="f-s white">닉네임을 입력하시면 사용 가능합니다 ! </p>
          </>
        ) : (
          <>
            <ul className="m-b min-h">
              {todos.map((item, index) => (
                <li
                  key={index}
                  className={`${item.checked ? "checked" : ""} flex s-b`}
                >
                  <div
                    className="text-over"
                    onClick={() => handleToggle(index)}
                  >
                    <span className="list">●</span>
                    <span>{item.text}</span>
                  </div>
                  <span
                    className="text-right"
                    onClick={() => handleDelete(index)}
                  >
                    x
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <form onSubmit={Submit} className="border-b-white m-h flex flex-end">
        <div className="line-h25 w-full">
          {User === "Guest" ? null : (
            <div className="flex flex-end s-b ">
              <input
                type="text"
                placeholder="Write down your list"
                className="todoInput"
                value={InputValue}
                onChange={InputChange}
              />
              <button className="button">
                <svg
                  fill="white"
                  height="10px"
                  width="10px"
                  version="1.1"
                  id="Capa_1"
                  viewBox="0 0 495.003 495.003"
                >
                  <g id="XMLID_51_">
                    <path
                      id="XMLID_53_"
                      d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616   l-67.6-32.22V456.687z"
                    />
                    <path
                      id="XMLID_52_"
                      d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422   c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414   l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956   L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z"
                    />
                  </g>
                </svg>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TodolistCard;
