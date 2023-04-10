import { useState } from 'react';

interface Props {
  maxLength: number;
  children: string;
}

export const ExpandableText = ({ maxLength, children }: Props) => {
  const isTruncated = children.length > maxLength;
  const [showTruncated, setShowtruncated] = useState<boolean>(isTruncated);
  const textTruncated = children.substring(0, maxLength - 3) + '...';

  return (
    <>
      <p>{showTruncated ? textTruncated : children}</p>
      {isTruncated && (
        <button onClick={() => setShowtruncated(!showTruncated)}>
          {showTruncated ? 'Show more' : 'Hide'}
         </button>
      )}
    </>
  );
};
