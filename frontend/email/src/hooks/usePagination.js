import { useState, useMemo } from 'react';

const usePagination = (data , itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Total number of pages
  const maxPage = Math.ceil(data.length / itemsPerPage);

  // Get data for the current page using useMemo for optimization
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage, itemsPerPage]);

  // Move to next page
  const nextPage = () => {
    setCurrentPage((prev) => (prev < maxPage ? prev + 1 : prev));
  };

  // Move to previous page
  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Go to a specific page
  const goToPage = (page) => {
    const num = Math.max(1, Math.min(page, maxPage)); // Clamp between 1 and maxPage
    setCurrentPage(num);
  };

  return {
    currentData,    // The data for the current page
    currentPage,    // Current page number
    maxPage,        // Total number of pages
    nextPage,       // Function to go to next page
    prevPage,       // Function to go to previous page
    goToPage        // Function to go to a specific page
  };
};

export default usePagination;
