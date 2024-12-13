import React from "react";
import Modal from "react-modal";

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Logout Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-content">
        <h2>로그아웃 하시겠습니까?</h2>
        <p>로그아웃을 누르시면 모든 데이터가 삭제 됩니다.</p>
        <div className="modal-actions">
          <button className="btn confirm-btn" onClick={onLogout}>
            로그아웃
          </button>
          <button className="btn cancel-btn" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
