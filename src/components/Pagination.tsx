interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  startResult: number;
  endResult: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalCount,
  startResult,
  endResult,
  onPageChange,
}: PaginationProps) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pt-5 flex justify-between items-center">
      <div className="text-gray-100 text-xs">
        Showing {startResult}-{endResult} results of {totalCount.toLocaleString()}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2 py-1.5 bg-gray-700 rounded-md text-gray-100 text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>

        {pageNumbers.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="w-8 px-2.5 py-1.5 bg-gray-700 rounded-md text-gray-100 text-sm text-center"
              >
                ...
              </div>
            );
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum as number)}
              className={`w-8 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2 py-1.5 bg-gray-700 rounded-md text-gray-100 text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};