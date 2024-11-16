import React, { useState, useEffect } from 'react';
import { GET_GAUGE_DATA_URL, GET_LOCATION_GNAME_URL } from '../../../utils/apiUrls';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaEye } from 'react-icons/fa';  // Importing the icons
import "bootstrap/dist/css/bootstrap.min.css";
import "../../csspage/cal_agency_table.css";

const CalHmeReport = () => {
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState({ data: [], header_names: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

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

  const filteredData = tableData.data.filter((row) => {
    return Object.values(row).some((cell) =>
      String(cell).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewReport = (gauge) => {
    // Build the URL with state as query params or path if needed
    const url = `/cal_report?gaugeId=${gauge.gauge_id_no}`; 
    window.open(url, '_blank');  // '_blank' opens the URL in a new tab
  };

  const handleViewFilledReport = async (gaugeId) => {
    try {
      const response = await axios.get(`${GET_LOCATION_GNAME_URL}?gauge_id=${gaugeId}`);
      const { gauges: gaugeName, location: gaugeLocation } = response.data;

      const url = `/cal_view_report?gaugeId=${gaugeId}&gaugeName=${gaugeName}&gaugeLocation=${gaugeLocation}`;
      window.open(url, '_blank');  // Open the report in a new tab
    } catch (error) {
      console.error("Error fetching gauge details:", error);
    }
  };

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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                <td>
                  <button 
                    onClick={() => handleViewReport(row)} 
                    style={{ marginRight: '20px' }}
                  >
                    <FaPen style={{ marginRight: '5px' }} /> 
                  </button>
                  <button onClick={() => handleViewFilledReport(row.gauge_id_no)}>
                    <FaEye style={{ marginRight: '5px' }} /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
  <div className="pagination">
    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
      Previous
    </button>

    {/* Center the page numbers */}
    <div className="page-numbers">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={currentPage === number ? 'active' : ''}
        >
          {number}
        </button>
      ))}
    </div>

    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
      Next
    </button>

    <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
      Last
    </button>
  </div>
</div>
    </div>
  );
};

export default CalHmeReport;
