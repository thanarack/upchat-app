import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { GetIcon } from '../utils/icon';
import './ModalComponent.scss';

const ModalComponent = (props: any) => {
  const { children, isOpen, onClose, title } = props;
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  if (!open) return null;

  return (
    <div className={classNames('fixed top-0 left-0 w-full h-screen z-50')}>
      <div className="absolute top-0 left-0 bg-gray-900 w-full h-screen opacity-70 z-30"></div>
      <div className="absolute top-0 left-0 text-gray-900 z-40 w-full h-full">
        <div className="flex flex-col justify-center items-center">
          <div className="lg:w-5/12 w-8/12 bg-white rounded-md px-6 py-6 mt-6 relative text-left">
            <span
              className="absolute right-5 top-6 cursor-pointer"
              onClick={onClose}
            >
              <GetIcon
                mode="outline"
                name="close"
                className="close text-gray-600"
                size="lg"
              />
            </span>
            {title && <div className="mb-6 font-ibm font-medium text-lg text-gray-600">{title}</div>}
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
