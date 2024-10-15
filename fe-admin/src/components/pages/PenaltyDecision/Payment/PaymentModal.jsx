// PaymentModal.js
import React from "react";
import { Button, Modal } from "react-bootstrap";
import VnPayForm from "./VnpayForm";

function PaymentModal({ show, handleClose, decisionId }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nộp Phạt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <VnPayForm decisionId={decisionId} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PaymentModal;
