import React from 'react';

interface Props {
  type: ButtonType;
  text: string;
  onClickHandler: (button) => void;
}

export const BootstrapButton = ({ type, text, onClickHandler }: Props) => {
  return (
    <button type='button' className={`btn ${type}`} onClick={(event) => onClickHandler(event.target)}>
      {text}
    </button>
  );
};

export enum ButtonType {
  Primary = 'btn-primary',
  Secondary = 'btn-secondary',
}
