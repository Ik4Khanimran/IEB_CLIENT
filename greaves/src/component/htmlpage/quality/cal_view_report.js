import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../csspage/cal_report.css";
import { useLocation } from "react-router-dom"; 
import axios from "axios"; 
import { GET_CAL_REPORT_RESULT_URL, GET_LEAST_COUNT_FREQ_URL } from "../../../utils/apiUrls"; 

const CalReportResult = () => {
  const { search } = useLocation(); // Using useLocation to get search parameters
  const params = new URLSearchParams(search); // Parse query string
  
  // Extracting values from URL query string
  const gaugeId = params.get("gaugeId");
  const gaugeName = params.get("gaugeName");
  const gaugeLocation = params.get("gaugeLocation");

  const [calibrationDate, setCalibrationDate] = useState("N/A"); 
  const [nextCalibrationDate, setNextCalibrationDate] = useState("N/A"); 
  const [calCertPath, setCalCertPath] = useState("N/A"); 
  const [traceCertPath, setTraceCertPath] = useState("N/A"); 
  const [remark, setRemark] = useState("N/A"); 
  const [verifiedBy, setVerifiedBy] = useState("N/A"); 
  const [approvedBy, setApprovedBy] = useState("N/A"); 
  const [frequency, setFrequency] = useState("N/A");
  const [leastCount, setLeastCount] = useState("N/A");

  useEffect(() => {
    if (!gaugeId || gaugeId === "N/A") {
      console.error("No valid gauge_id_no provided. Exiting.");
      return; 
    }

    const fetchCalibrationData = async () => {
      try {
        const response = await axios.get(`${GET_CAL_REPORT_RESULT_URL}?gauge_id=${gaugeId}`);
        console.log("Calibration data response:", response.data); // Log the full response
        if (response.data) {
          setCalibrationDate(response.data.last_cal_date || "N/A");
          setNextCalibrationDate(response.data.next_cal_date || "N/A");
          setCalCertPath(response.data.cal_certificate_fpath || "N/A");
          setTraceCertPath(response.data.tracebility_cert_path || "N/A");
          setRemark(response.data.remark || "N/A");
          setVerifiedBy(response.data.verified_by || "N/A");
          setApprovedBy(response.data.approved_by || "N/A");
        }
      } catch (error) {
        console.error("Error fetching calibration data:", error.response ? error.response.data : error.message);
      }
    };

    const fetchFrequencyAndLeastCount = async () => {
      try {
        const response = await axios.get(`${GET_LEAST_COUNT_FREQ_URL}?gauge_id=${gaugeId}`);
        if (response.data) {
          setFrequency(response.data.frequency || "N/A");
          setLeastCount(response.data.least_count || "N/A");
        }
      } catch (error) {
        console.error("Error fetching frequency and least count:", error.response ? error.response.data : error.message);
      }
    };

    fetchCalibrationData();
    fetchFrequencyAndLeastCount();
  }, [gaugeId]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date as MM/DD/YYYY
  };

  // Helper function to generate full file URL
  const getFullFileUrl = (filePath) => {
    if (filePath === "N/A" || !filePath) return "N/A"; // Handle N/A cases
  
    // Define the base directory of the media folder (this should be the relative path to your media folder)
    const baseDir = 'D:/Server_Folders/IEB_Server/Greaves/Cal_Report'; // This is just an example, replace with your base directory
  
    // Ensure that baseDir ends with a slash for consistency
    let normalizedBaseDir = baseDir.replace(/\\/g, '/'); // Convert backslashes to forward slashes
    if (!normalizedBaseDir.endsWith('/')) {
      normalizedBaseDir += '/'; // Add the slash if necessary
    }
  
    // Remove the base directory from the file path to get the relative path
    let relativeFilePath = filePath.replace(normalizedBaseDir, '').replace(/\\/g, '/'); // Normalize backslashes to forward slashes
  
    // Ensure there is a leading slash between the media URL and the relative file path
    if (!relativeFilePath.startsWith('/')) {
      relativeFilePath = '/' + relativeFilePath;
    }
  
    // Generate the full URL with the '/media' prefix
    const fullUrl = `http://localhost:8000/media${relativeFilePath}`;
  
    console.log("Generated file URL:", fullUrl); // Log for debugging
    return fullUrl;
  };

  return (
    <div className="container calibration-report">
      <header className="text-center mb-4">
        <img
          loading="lazy"
          itemProp="image"
          src="https://greavescotton.com/wp-content/uploads/2024/02/Greaves-blue-logo-300x80-1.png"
          width="300"
          height="80"
          alt="Greaves Logo"
          title="Greaves Cotton Logo"
        />
      </header>

      <div className="table-wrapper mx-auto">
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead>
              <tr>
                <th colSpan="2"><p>Industrial Engine Unit<br />L.E.U.-IV</p></th>
                <th colSpan="2"><h2>GAUGE/INSTRUMENT/EQUIPMENT CALIBRATION CARD</h2></th>
                <th colSpan="2"><p>DOC.No.: SD.3.01<br />REV.No.: 01</p></th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      <div className="table-wrapper mx-auto">
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle w-100">
            <tbody>
              <tr>
                <td style={{ width: "20%" }}><p>Calibration Frequency:</p></td>
                <td colSpan="3"><p>{frequency}</p></td>
              </tr>
              <tr>
                <td><p>Name of Gauge/Instrument/Equipment:</p></td>
                <td><p>{gaugeName || "N/A"}</p></td>
                <td><p>Size / Range:</p></td>
                <td><input type="text" className="form-control" /></td>
              </tr>
              <tr>
                <td><p>Least Count:</p></td>
                <td><p>{leastCount}</p></td>
                <td><p>Make:</p></td>
                <td><input type="text" className="form-control" /></td>
              </tr>
              <tr>
                <td><p>GCL ID:</p></td>
                <td><input type="text" className="form-control" /></td>
                <td><p>Location:</p></td>
                <td><p>{gaugeLocation || "N/A"}</p></td>
              </tr>
              <tr>
                <td><p>Mfg.ID/Sr.No.:</p></td>
                <td colSpan="3"><p>{gaugeId || "N/A"}</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-wrapper mx-auto">
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle w-100">
            <thead>
              <tr>
                <th>Date of Calibration</th>
                <th>Next Calibration Date</th>
                <th>Calibration Certificate</th>
                <th>Traceability Certificate</th>
                <th>Remark</th>
                <th>Verified By</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(calibrationDate)}</td>
                <td>{formatDate(nextCalibrationDate)}</td>
                <td>
                  {calCertPath !== "N/A" && (
                    <a 
                      href={getFullFileUrl(calCertPath)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ marginRight: '10px' }}
                    >
                      View
                    </a>
                  )}
                  {calCertPath !== "N/A" && (
                    <a href={getFullFileUrl(calCertPath)} download>
                      Download
                    </a>
                  )}
                </td>
                <td>
                  {traceCertPath !== "N/A" && (
                    <a 
                      href={getFullFileUrl(traceCertPath)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ marginRight: '10px' }}
                    >
                      View
                    </a>
                  )}
                  {traceCertPath !== "N/A" && (
                    <a href={getFullFileUrl(traceCertPath)} download>
                      Download
                    </a>
                  )}
                </td>
                <td>{remark}</td>
                <td>{verifiedBy}</td>
                <td>{approvedBy}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CalReportResult;
