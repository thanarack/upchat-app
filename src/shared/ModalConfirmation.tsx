import { useEffect, useState } from 'react';
import ModalComponent from './ModalComponent';

const ModalConfirmation = (props: any) => {
  const { isOpen, onClose, onCancel, title, onAccept } = props;
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  if (!open) return null;

  return (
    <ModalComponent title={title} isOpen={open} onClose={onClose}>
      <div className="md-confirmation">
        <button onClick={onAccept} className="accept">
          ตกลง
        </button>
        <button onClick={onCancel} className="denied">
          ยกเลิก
        </button>
      </div>
    </ModalComponent>
  );
};

export default ModalConfirmation;
