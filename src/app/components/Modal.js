// components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='popup-modal'>
        {/* <button className="modal-closeButton" onClick={onClose} >X</button> */}
        {children}
      </div>
    </div>
  );
};



export default Modal;
