import React from 'react';

interface Props {
  type: ButtonType;
  text: string;
  onClickHandler: (type: ButtonType) => void;
}

export const BootstrapButton = ({ type, text, onClickHandler }: Props) => {
  return (
    <button type='button' className={`btn ${type}`} onClick={(event) => onClickHandler(type)}>
      {text}
    </button>
  );
};

export enum ButtonType {
  Primary = 'btn-primary',
  Secondary = 'btn-secondary',
}
