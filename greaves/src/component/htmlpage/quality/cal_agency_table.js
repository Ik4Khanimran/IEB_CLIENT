import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  GET_CAL_AGENCY_URL, 
  GET_GAUGE_TYPE_URL, 
  UPDATE_CAL_AGENCY_URL, 
  UPDATE_GAUGE_TYPE_URL, 
  DELETE_CAL_AGENCY_URL, 
  DELETE_GAUGE_TYPE_URL,
  UPDATE_CAL_LOCATION_URL,
  DELETE_CAL_LOCATION_URL,
  GET_CAL_LOCATION_URL,
  GET_CAL_STATUS_URL,
  DELETE_CAL_STATUS_URL,
  UPDATE_CAL_STATUS_URL,
  GET_GAUGE_DATA_URL,
  DELETE_GAUGE_DATA_URL,
  UPDATE_GAUGE_DATA_URL,
  GET_CAL_MAILER_LIST_URL,
  DELETE_CAL_MAILER_URL,
  UPDATE_CAL_MAILER_URL,
} from '../../../utils/apiUrls';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

const ITEMS_PER_PAGE = 10; // Number of items per page

const CalEntryTable = () => {
  const navigate = useNavigate();

  const [selectedTable, setSelectedTable] = useState('data');
  const [tableData, setTableData] = useState({ data: [], header_names: [] });
  const [editingEntry, setEditingEntry] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [currentPage, setCurrentPage] = useState(1); // Current page state

  // Fetch data based on selected table
  const fetchTableData = async (tableType) => {
    let url;
    if (tableType === 'calibration') {
      url = GET_CAL_AGENCY_URL;
    } else if (tableType === 'gauge') {
      url = GET_GAUGE_TYPE_URL;
    } else if (tableType === 'location') {
      url = GET_CAL_LOCATION_URL; // New URL for Calibration Location table
    } else if (tableType === 'status'){
      url = GET_CAL_STATUS_URL; // Handle any other cases if needed
    } else if (tableType === 'data'){
      url = GET_GAUGE_DATA_URL; // Handle any other cases if needed
    } else if (tableType === 'mailerlist'){
      url = GET_CAL_MAILER_LIST_URL; // Handle any other cases if needed
    }
    
    if (url) {
      try {
        const response = await axios.get(url);
        if (response.data && Array.isArray(response.data.values) && response.data.values.length > 0) {
          setTableData({
            data: response.data.values,
            header_names: response.data.header_names,
          });
        } else {
          setTableData({ data: [], header_names: [] });
        }
      } catch (error) {
        console.error(`Error fetching ${tableType} data:`, error);
        setTableData({ data: [], header_names: [] });
      }
    }
  };

  // Fetch the data when selectedTable changes
  useEffect(() => {
    fetchTableData(selectedTable);
    setCurrentPage(1); // Reset to the first page when changing table
    setEditingEntry(null); // Reset editing state
    setEditedData({}); // Clear edited data
  }, [selectedTable]);

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry.id);
    setEditedData(entry);
  };

  const handleDelete = async (id) => {
    let url;
    if (selectedTable === 'calibration') {
      url = `${DELETE_CAL_AGENCY_URL}${id}/`;
    } else if (selectedTable === 'gauge') {
      url = `${DELETE_GAUGE_TYPE_URL}${id}/`;
    } else if (selectedTable === 'location') {
      url = `${DELETE_CAL_LOCATION_URL}${id}/`; // Delete URL for Calibration Location
    } else if (selectedTable === 'status') {
      url = `${DELETE_CAL_STATUS_URL}${id}/`; // Delete URL for Calibration Location
    } else if (selectedTable === 'data') {
      url = `${DELETE_GAUGE_DATA_URL}${id}/`; // Delete URL for Calibration Location
    } else if (selectedTable === 'mailerlist') {
      url = `${DELETE_CAL_MAILER_URL}${id}/`; // Delete URL for Calibration Mailer List
    }
    
    if (url) {
      try {
        await axios.delete(url);
        setTableData((prevData) => ({
          ...prevData,
          data: prevData.data.filter((entry) => entry.id !== id), // Correctly filter out the deleted entry
        }));
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (id) => {
    let url;
    if (selectedTable === 'calibration') {
      url = `${UPDATE_CAL_AGENCY_URL}${id}/`;
    } else if (selectedTable === 'gauge') {
      url = `${UPDATE_GAUGE_TYPE_URL}${id}/`;
    } else if (selectedTable === 'location') {
      url = `${UPDATE_CAL_LOCATION_URL}${id}/`; // Update URL for Calibration Location
    } else if (selectedTable === 'status') {
      url = `${UPDATE_CAL_STATUS_URL}${id}/`; // Update URL for Calibration Status
    } else if (selectedTable === 'data') {
      url = `${UPDATE_GAUGE_DATA_URL}${id}/`; // Update URL for Gauge Data
    } else if (selectedTable === 'mailerlist') {
      url = `${UPDATE_CAL_MAILER_URL}${id}/`; // Update URL for Calibration Mailer List
    }
    
    if (url) {
      try {
        const response = await axios.put(url, editedData);
        if (response.status === 200) {
          setTableData((prevData) => ({
            ...prevData,
            data: prevData.data.map((entry) => (entry.id === id ? { ...entry, ...editedData } : entry)),
          }));
          setEditingEntry(null);
          setEditedData({});
        }
      } catch (error) {
        console.error('Error updating entry:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingEntry(null);
    setEditedData({});
  };

  // Filter data based on the search term
  const filteredData = tableData.data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const renderTable = () => {
    if (paginatedData.length === 0) {
      return <p>No data available.</p>;
    }
    
    const isTableOverflowing = (data, headers) => {
      const maxRowsBeforeOverflow = 10; // Set limit based on your vertical space
      return data.length > maxRowsBeforeOverflow;
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', padding: '10px' }}>
        {/* Allow horizontal scrolling but avoid vertical scroll */}
        <div style={{ flexGrow: 1, overflowX: 'auto' }}>
          <table 
            className="table table-striped table-bordered"
            style={{
              width: '100%',
              tableLayout: 'auto', // Let table width adjust for overflowed columns
              fontSize: isTableOverflowing(paginatedData, tableData.header_names) ? '0.85rem' : '1rem',
            }}
          >
            <thead>
              <tr>
                {tableData.header_names.map((header, index) => (
                  <th
                    key={index}
                    style={{
                      padding: '10px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {header}
                  </th>
                ))}
                <th>Actions</th> {/* Actions column */}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {tableData.header_names.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        padding: '10px',
                        whiteSpace: 'nowrap', // Prevent text wrapping in general
                      }}
                    >
                      {editingEntry === row.id ? (
                        <input
                          type="text"
                          name={header}
                          value={editedData[header] || ''}
                          onChange={handleChange}
                          className="form-control form-control-sm"
                          style={{ fontSize: '1rem' }}
                        />
                      ) : (
                        row[header] // Display cell data
                      )}
                    </td>
                  ))}
                  <td style={{ padding: '10px' }}>
                    {editingEntry === row.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleSave(row.id)}
                          style={{ fontSize: '1rem' }}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancel}
                          style={{ fontSize: '1rem' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <BsPencilSquare
                          className="text-primary mr-2"
                          onClick={() => handleEdit(row)}
                          style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                        />
                        <BsTrash
                          onClick={() => handleDelete(row.id)}
                          style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <nav style={{ marginTop: 'auto' }}>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
            </li>
            {[...Array(totalPages)].slice(Math.max(0, currentPage - 2), currentPage + 1).map((_, index) => {
              const page = currentPage - 1 + index;
              return (
                <li key={page} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                    {page + 1}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(totalPages)}>Last</button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  const handleCreateNewPoint = () => {
    // Navigate to create new point page
    navigate('/cal_agency_newentry', { state: { selectedTable } });
  };

  // const handleCreateNewPoint = () => {
  //   // Use the selectedTable state to pass it via URL parameters
  //   const url = `/cal_agency_newentry?table=${selectedTable}`;
  //   window.open(url, '_blank');  // Open the new page in a new tab/window
  // };

  return (
    <div className="container-fluid mt-2"> {/* Increased margin at the top */}
      <div className="row mb-3 align-items-center">
        {/* Dropdown Box */}
        <div className="col-md-3">
          <select className="form-select" value={selectedTable} onChange={handleTableChange}>
            <option value="data">Gauge Data</option>
            <option value="status">Calibration Status</option>
            <option value="gauge">Gauge Type</option>
            <option value="location">Calibration Location</option>
            <option value="calibration">Calibration Agency</option>
            <option value="mailerlist">Mailer List</option>
          </select>
        </div>

        {/* Search Box */}
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Create New Point Button */}
        <div className="col-md-2 d-flex justify-content-end">
          <button className="btn btn-secondary btn-sm" onClick={handleCreateNewPoint}> {/* Small button size */}
            Create New Point
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="row">
        <div className="col-12"> {/* Ensures the table takes full width */}
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default CalEntryTable;
