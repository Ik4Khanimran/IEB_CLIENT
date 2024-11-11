import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { GET_CAL_MAILER_LIST_URL, DELETE_CAL_MAILER_URL, UPDATE_CAL_MAILER_URL, GET_GAUGEID_MAIL_URL, DELETE_GAUGEID_MAIL_URL, UPDATE_GAUGEID_MAIL_URL, ADD_GAUGEID_MAIL_URL } from '../../../utils/apiUrls';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const MailerList = () => {
    const [tableData, setTableData] = useState([]);
    const [headerNames, setHeaderNames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingEntry, setEditingEntry] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTable, setSelectedTable] = useState('mailer');
    const [newRow, setNewRow] = useState(null); // State for new row
    const navigate = useNavigate();

    // Fetch data from the selected table
    const fetchData = async (table) => {
        try {
            let url = GET_CAL_MAILER_LIST_URL;
            if (table === 'gauge') {
                url = GET_GAUGEID_MAIL_URL;
            }

            const response = await axios.get(url);
            setTableData(response.data.values || []);
            setHeaderNames(response.data.header_names || []);
        } catch (error) {
            console.error('Error fetching mailer list:', error);
        }
    };

    useEffect(() => {
        fetchData(selectedTable);
    }, [selectedTable]);

    const handleEdit = (entry) => {
        setEditingEntry(entry.id);
        setEditedData(entry);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async (id) => {
        try {
            let url = UPDATE_CAL_MAILER_URL;
            if (selectedTable === 'gauge') {
                url = UPDATE_GAUGEID_MAIL_URL;
            }

            await axios.put(`${url}${id}/`, editedData);
            fetchData(selectedTable);
            setEditingEntry(null);
            setEditedData({});
        } catch (error) {
            console.error('Error saving entry:', error);
        }
    };

    const handleCancel = () => {
        setEditingEntry(null);
        setEditedData({});
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                let url = DELETE_CAL_MAILER_URL;
                if (selectedTable === 'gauge') {
                    url = DELETE_GAUGEID_MAIL_URL;
                }

                await axios.delete(`${url}${id}/`);
                fetchData(selectedTable);
            } catch (error) {
                console.error('Error deleting entry:', error);
            }
        }
    };

    const handleCreateNewPoint = () => {
        navigate('/cal_mailer_newentry');
    };

    // Handle adding a new row
    const handleAddNewRow = () => {
        const emptyRow = {};
        headerNames.forEach((header) => {
            emptyRow[header] = '';
        });
        setNewRow(emptyRow); // Show a new row with input fields
    };

    // Handle input change for new row
    const handleNewRowChange = (e) => {
        const { name, value } = e.target;
        setNewRow((prevRow) => ({
            ...prevRow,
            [name]: value,
        }));
    };

    // Save the new row to the backend
    const handleSaveNewRow = async () => {
        try {
            const response = await axios.post(ADD_GAUGEID_MAIL_URL, newRow);
            fetchData(selectedTable); // Refresh the table with new data
            setNewRow(null); // Reset the new row state
        } catch (error) {
            console.error('Error adding new row:', error);
        }
    };

    // Cancel adding a new row
    const handleCancelNewRow = () => {
        setNewRow(null); // Remove the new row
    };

    // Filter data based on search term
    const filteredData = tableData.filter((row) =>
        Object.values(row).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleTableChange = (e) => {
        setSelectedTable(e.target.value);
    };

    return (
        <div className="container">
            <h4>Data Table Viewer</h4>

            {/* Dropdown to select table */}
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <select
                    className="form-control me-2"
                    value={selectedTable}
                    onChange={handleTableChange}
                >
                    <option value="mailer">Mailer List</option>
                    <option value="gauge">Gauge Mailer</option>
                </select>

                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleCreateNewPoint}
                    disabled={selectedTable === 'gauge'} // Enable for 'mailer', disable for 'gauge'
                >
                    Create New Point
                </button>
                <button
                    className="btn btn-success"
                    onClick={handleAddNewRow}
                    disabled={selectedTable === 'mailer'} // Disable if 'mailer' is selected
                >
                    Add New Entry
                </button>
            </div>

            {/* Table for displaying data */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        {headerNames.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show the new row if it exists */}
                    {newRow && (
                        <tr>
                            {headerNames.map((header, index) => (
                                <td key={index}>
                                    <input
                                        type="text"
                                        name={header}
                                        value={newRow[header] || ''}
                                        onChange={handleNewRowChange}
                                    />
                                </td>
                            ))}
                            <td>
                                <button className="btn btn-success" onClick={handleSaveNewRow}>
                                    Save
                                </button>
                                <button className="btn btn-secondary" onClick={handleCancelNewRow}>
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    )}

                    {paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan={headerNames.length + 1} className="text-center">
                                No data available.
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((row) => (
                            <tr key={row.id}>
                                {headerNames.map((header, colIndex) => (
                                    <td key={colIndex}>
                                        {editingEntry === row.id ? (
                                            <input
                                                type="text"
                                                name={header}
                                                value={editedData[header] || ''}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            row[header]
                                        )}
                                    </td>
                                ))}
                                <td>
                                    {editingEntry === row.id ? (
                                        <>
                                            <button className="btn btn-success" onClick={() => handleSave(row.id)}>Save</button>
                                            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <BsPencilSquare onClick={() => handleEdit(row)} style={{ cursor: 'pointer' }} />
                                            <BsTrash onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer' }} />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default MailerList;
