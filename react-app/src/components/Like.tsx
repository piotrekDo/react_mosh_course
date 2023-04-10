import { useState } from 'react';
import { FcLikePlaceholder } from 'react-icons/fc';
import { FcLike } from 'react-icons/fc';

interface Prosps {
  like: (isLiking: boolean) => void;
}

export const Like = ({ like }: Prosps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const onClickHandler = () => {
      like(!isLiked);
      setIsLiked(!isLiked);
  };

  return (
    <div onClick={onClickHandler}>
      {!isLiked && <FcLikePlaceholder size={'2rem'} />}
      {isLiked && <FcLike size={'2rem'} />}
    </div>
  );
};
