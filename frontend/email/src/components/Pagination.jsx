const Pagination = ({ currentPage, maxPage, onNext, onPrev, goToPage }) => {
  return (
    <div className="flex justify-center items-center mt-4 space-x-2">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      {[...Array(maxPage)].map((_, i) => (
        <button
          key={i}
          onClick={() => goToPage(i + 1)}
          className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={onNext}
        disabled={currentPage === maxPage}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

