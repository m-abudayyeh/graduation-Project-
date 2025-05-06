// src/components/common/Pagination.jsx
const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  if (totalPages <= 1) {
    return null;
  }
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
    
    pageNumbers.push(1);
    
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3));
    }
    
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="w-full py-4 px-2  border-t border-gray-200 flex justify-center">
      <nav className="flex flex-wrap items-center justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 sm:px-3 py-2 sm:py-1 text-sm rounded-l-md border ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          aria-label="Previous page"
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="inline sm:hidden">←</span>
        </button>
        
        <div className="flex flex-wrap">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`min-w-[36px] px-2 sm:px-3 py-2 sm:py-1 text-sm border-t border-b border-l ${
                page === currentPage
                  ? 'bg-[#FF5E14] text-white font-medium'
                  : page === '...'
                  ? 'bg-white text-gray-400'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-label={typeof page === 'number' ? `Go to page ${page}` : 'More pages'}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 sm:px-3 py-2 sm:py-1 text-sm rounded-r-md border border-l-0 ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="inline sm:hidden">→</span>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;