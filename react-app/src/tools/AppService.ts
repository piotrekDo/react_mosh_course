import { ButtonType } from '../components/BootstrapButton';

export const setAlertTextHandler = (type: ButtonType) => {
  switch (type) {
    case ButtonType.Primary:
      return 'Primary button activated';
      break;
    case ButtonType.Secondary:
      return 'Secondary button activated';
      break;
    default:
      return 'Alert activated';
  }
};
