import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../../../utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useLocation } from 'react-router-dom';
import { GET_ASSEMBLYOP_DATA_URL } from '../../../utils/apiUrls';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Assemblyopresult = () => {
  const [resultData, setResultData] = useState(null);
  const [engineData, setEngineData] = useState(null);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false); // Flag to prevent double fetch
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const esn_r = params.get('esn');
  const stno_r = params.get('stno');
  const [username] = useState(sessionStorage.getItem('name') || 'Unknown User');
  const [userId] = useState(sessionStorage.getItem('emp_id') || 'Unknown ID');

  const getSessionData = useCallback(() => {
    const csrfToken = sessionStorage.getItem('csrfToken');
    return { csrfToken };
  }, []);

  const fetchData = useCallback(async () => {
    if (hasFetchedData.current) return; // Prevent double fetch

    if (!esn_r || !stno_r) {
      console.error('ESN or STNO is missing');
      return;
    }

    hasFetchedData.current = true; // Set flag to true after the first call

    try {
      const { csrfToken } = getSessionData();
      const response = await axios.post(GET_ASSEMBLYOP_DATA_URL, {
        esn_r,
        stno_r,
      }, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setResultData(response.data.data[0]); // Save the result data
        setEngineData(response.data.header_data)
        
      } else {
        console.error('Error Message:', response.data.message);
        setError(response.data.message || 'Error fetching data');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching data');
    }
  }, [getSessionData, esn_r, stno_r]);

  useEffect(() => {
    document.title = "Result";
    fetchData();
  }, [fetchData]);


  return (
    <div className="container2">
      <div className="row justify-content-center align-items-center">
        <div className="col-2 greaves"> GREAVES </div>
        <div className="col-8">
          <h2 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
          Engine Assembly Roll Down Result
          </h2>
        </div>
        <div className="col-2 ieb"> Industrial Engine Unit </div>
      </div>

      <div className="row justify-content-center mt-3">
        <button className="btn btn-primary">Operation Done</button>
      </div>
      <div className="row justify-content-center align-items-center mt-4 mb-4">
        <div className="row mx-4">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th colSpan="6" className="text-center">Engine Detail</th>
                </tr>
              </thead>
              <tbody>
                {resultData ? (
                  <>
                  <tr>
                    <th>Engine Sr No</th>
                    <td>{engineData.esn}</td>
                    <th>Model</th>
                    <td>{engineData?.engmodel || 'N/A'}</td>
                    <th>Engine Type</th>
                    <td>{engineData?.type || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td colSpan={1}>{engineData?.description || 'N/A'}</td>
                    <th>Bom</th>
                    <td>{engineData?.bom || 'N/A'}</td>
                    <th>Station No</th>
                    <td>{engineData?.stno || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{username}</td>
                    <th>Emp Id</th>
                    <td>{userId}</td>
                    <th>Date & Time</th>
                    <td>{resultData?.timestamp ? new Date(resultData.timestamp).toLocaleString() : 'N/A'}</td>
                    {/* <td>{new Date(resultData.time_stamp).toLocaleString()}</td> */}
                  </tr>
                </>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center text-danger">{error}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row justify-content-center align-items-center mt-4 mb-4">
        <div className="row mx-4">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th colSpan="2" className="text-center">Assembly Engine Details</th>
                </tr>
              </thead>
              <tbody>
              {resultData ? (
              <>
                <tr>
                  <th>Crank Case No</th>
                  <td>{resultData.crankcase_no || 'N/A'}</td>
                </tr>
                <tr>
                  <th>FIP No</th>
                  <td>{resultData.fip_no || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Turbo No</th>
                  <td>{resultData.turbo_no || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Remark</th>
                  <td>{resultData.remark || 'N/A'}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="2" className="text-center">Loading...</td>
              </tr>
            )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Assemblyopresult;
