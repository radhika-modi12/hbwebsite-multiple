import React from 'react';
import { Modal } from 'react-bootstrap';

function PopupModal({
  show,
  handleClose,
  headerTitle,
  children,
  modalFooter = '',
}) {
  return (
    <Modal show={show} onHide={handleClose} animation={false}>
    <Modal.Header>
        <Modal.Title>{headerTitle}</Modal.Title> 
    </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {modalFooter && <Modal.Footer>{modalFooter}</Modal.Footer>}
    </Modal>
  );
}

export default PopupModal;



