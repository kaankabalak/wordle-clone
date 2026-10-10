import { useEffect, useRef } from "react";
import "./Modal.css";

function Modal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return
    }

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  if (isOpen) {
    return (
      <dialog ref={dialogRef} className="modal" onCancel={onClose}>
        <button className="button" type="button" onClick={onClose}>×</button>
        {children}
      </dialog>
    );
  } else {
    return null;
  }
}

export default Modal;
