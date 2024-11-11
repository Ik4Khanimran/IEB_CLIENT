import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { GET_CAL_MAILER_LIST_URL, DELETE_CAL_MAILER_URL, UPDATE_CAL_MAILER_URL, GET_GAUGEID_MAIL_URL, DELETE_GAUGEID_MAIL_URL, UPDATE_GAUGEID_MAIL_URL } from '../../../utils/apiUrls';  // Import new URLs
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10; // Number of items per page

const MailerList = () => {
    const [tableData, setTableData] = useState([]);
    const [headerNames, setHeaderNames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingEntry, setEditingEntry] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const [selectedTable, setSelectedTable] = useState('mailer'); // Default to 'mailer'
    const navigate = useNavigate(); // Define navigate here

    // Fetch data from the selected table
    const fetchData = async (table) => {
        try {
            let url = GET_CAL_MAILER_LIST_URL; // Default to mailer table URL
            if (table === 'gauge') {
                url = GET_GAUGEID_MAIL_URL; // Use CAL_GAUGEID_MAIL_URL for gauge mailer data
            }

            const response = await axios.get(url);
            setTableData(response.data.values || []);
            setHeaderNames(response.data.header_names || []);
        } catch (error) {
            console.error('Error fetching mailer list:', error);
        }
    };

    useEffect(() => {
        fetchData(selectedTable); // Fetch data when table is selected
    }, [selectedTable]); // Dependency on selected table

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
            let url = UPDATE_CAL_MAILER_URL; // Default to mailer update URL
            if (selectedTable === 'gauge') {
                url = UPDATE_GAUGEID_MAIL_URL; // Use UPDATE_GAUGEID_MAIL_URL for gauge mailer update
            }

            await axios.put(`${url}${id}/`, editedData);
            fetchData(selectedTable); // Refresh the data after saving
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
                let url = DELETE_CAL_MAILER_URL; // Default to mailer delete URL
                if (selectedTable === 'gauge') {
                    url = DELETE_GAUGEID_MAIL_URL; // Use DELETE_GAUGEID_MAIL_URL for gauge mailer delete
                }

                await axios.delete(`${url}${id}/`);
                fetchData(selectedTable); // Refresh the data after deletion
            } catch (error) {
                console.error('Error deleting entry:', error);
            }
        }
    };

    const handleCreateNewPoint = () => {
        navigate('/cal_mailer_newentry'); // Use navigate to go to the new page
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
        setSelectedTable(e.target.value); // Update selected table and fetch its data
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
                <button className="btn btn-primary" onClick={handleCreateNewPoint}>
                    Create New Point
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
