import { useEffect, useState } from 'react';
import Button from '../components/button/Button';
import ModalComponent from './ModalComponent';

const ModalConfirmation = (props: any) => {
  const { isOpen, onClose, onCancel, title, onAccept, acceptLoading } = props;
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  if (!open) return null;

  return (
    <ModalComponent title={title} isOpen={open} onClose={onClose}>
      <div className="md-confirmation">
        <Button text="ตกลง" onClick={onAccept} isLoading={acceptLoading} />
        <Button text="ยกเลิก" onClick={onCancel} variant="gray" />
      </div>
    </ModalComponent>
  );
};

ModalConfirmation.defaultProps = {
  acceptLoading: false,
};

export default ModalConfirmation;
