import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onCloseClickHandler: () => void;
}

export const Alert = ({ children, onCloseClickHandler }: Props) => {
  return (
    <div className='alert alert-primary alert-dismissible'>
      {children}
      <button
        type='button'
        className='btn-close'
        data-bs-dismiss='alert'
        aria-label='Close'
        onClick={onCloseClickHandler}
      ></button>
    </div>
  );
};
