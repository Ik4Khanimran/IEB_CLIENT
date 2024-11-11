import React, { useState, useEffect } from 'react';
import { GET_GAUGE_DATA_URL } from '../../../utils/apiUrls';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate

const CalHmeReport = () => {
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState({ data: [], header_names: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    axios
      .get(GET_GAUGE_DATA_URL, {
        params: { table_type: 'subset' },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setTableData({
          data: response.data.values,
          header_names: response.data.header_names,
        });
      })
      .catch((error) => {
        console.error('Error fetching gauge data:', error);
        setError(error.message);
      });
  }, []);

  // Filtered data based on search query
  const filteredData = tableData.data.filter((row) => {
    return Object.values(row).some((cell) =>
      String(cell).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewReport = (gauge) => {
    navigate('/cal_report', { state: { gauge } }); // Navigate to /cal-report page
  };

  // Determine the range of pages to display
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="cal-hme-report-container">
      <h2>Gauge Table</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              {tableData.header_names.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th>Action</th> {/* Add Action column */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                <td>
                  <button onClick={() => handleViewReport(row)}>
                    Fill Report {/* Button to open the respective calibration report */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Pagination Controls */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
        
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Last
        </button>
      </div>
    </div>
  );
};

export default CalHmeReport;
