import React, { useState } from "react";
import useStore from "../../store"; // Zustand store import
import LogoutModal from "../LogoutModal";

const UserCard = () => {
  const { User, setUser } = useStore();
  const [InputVaule, setInputVaule] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  const Submit = (event) => {
    event.preventDefault();
    setUser(InputVaule); // User 상태 업데이트
  };

  const InputChange = (event) => {
    setInputVaule(event.target.value);
  };

  const openModal = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser("Guest"); // 로그아웃 후 User 상태를 "Guest"로 변경
    closeModal(); // 모달 닫기
  };
  return (
    <div className="userCard">
      <form onSubmit={Submit}>
        {User === "Guest" ? (
          <input
            type="text"
            style={{ width: "90%" }}
            placeholder="YOUR NAME"
            size="12"
            value={InputVaule}
            onChange={InputChange}
          />
        ) : null}
        <div className="line-h25">
          {User === "Guest" ? (
            <>
              <p className="f-b f-s white">{User}님,</p>
              <p className="f-b f-s white">안녕하세요.</p>
              <p className="f-s white ">이름을 입력해주세요</p>
            </>
          ) : (
            <div className="m-x">
              <span className="f-b f-s white flex">
                <p className="text-over">{User}</p>
                <p>님,</p>
              </span>
              <p className="f-b f-s white">안녕하세요.</p>
              <button className="button" type="button" onClick={openModal}>
                로그아웃
              </button>
              <LogoutModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onLogout={handleLogout}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserCard;
