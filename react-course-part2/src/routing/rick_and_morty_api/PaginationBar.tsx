interface Props {
  currentPage: number;
  info: Info;
  switchPage: (page: number) => void;
}

export const PaginationBar = ({ currentPage, info, switchPage }: Props) => {
  const { count, pages, next, prev } = info;

  const pagess = pages;

  // offset wyznacza różnicę między ostatnią stroną a ilością stron po niej wyświetlaną. Jeżeli mamy 40 stron i obecnie
  // 39 to następna powinna być tylko 40.
  // start- punkt początkowy, uwzględniający offest, ruchomy, powininien wyznaczać więcej stron z początku, jeżeli
  // offset przekracza total pages
  // range- zawsze + / - pięć stron, stąd 11 lub mniej jeżeli nie ma doststępnych 11 stron

  const offset = Math.max(0, currentPage + 5 - pagess);
  const start = Math.max(1, Math.max(1, currentPage - 5) - offset);
  const range = Array.from({ length: Math.min(pagess, 11) }, (_, index) => index + start);

  return (
    <div className='bg-info d-flex justify-content-center mt-4 p-2'>
      <button disabled={currentPage < 2} onClick={() => switchPage(1)} className='btn btn-primary mx-1'>
        first
      </button>
      <button className='btn btn-primary mx-1' disabled={currentPage < 2} onClick={() => switchPage(currentPage - 1)}>
        prev
      </button>
      <div className="d-flex align-items-center">
        {range.map((pageNumber) => (
          <span key={pageNumber} style={{cursor: 'pointer'}} onClick={() => switchPage(pageNumber)}>
            {pageNumber === currentPage ? <strong>{pageNumber}</strong> : pageNumber}
          </span>
        ))}
      </div>
      <button
        className='btn btn-primary mx-1'
        disabled={currentPage > pagess - 1}
        onClick={() => switchPage(currentPage + 1)}
      >
        next
      </button>
      <button className='btn btn-primary mx-1' disabled={currentPage > pagess - 1} onClick={() => switchPage(pagess)}>
        last
      </button>
    </div>
  );
};
