

//  LAST UPDATED 24-10-2024 9:37 am





import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../csspage/cal_report.css"; 
import { FaFolderOpen } from "react-icons/fa";
import { useLocation, useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; 
import { GET_LEAST_COUNT_FREQ_URL, GET_CAL_DATE_URL, SUBMIT_CALIBRATION_URL } from "../../../utils/apiUrls";

const CalReport = () => {
  const navigate = useNavigate(); // Use the navigate function
  const { state } = useLocation(); 
  const gauge = state?.gauge || {};

  const [calibrationFrequency, setCalibrationFrequency] = useState(""); 
  const [calibrationDate, setCalibrationDate] = useState(""); 
  const [nextCalibrationDate, setNextCalibrationDate] = useState(""); 
  const [lastCalibrationDate, setLastCalibrationDate] = useState(""); 
  const { gaugeId } = useParams(); 
  const [frequency, setFrequency] = useState("N/A");
  const [leastCount, setLeastCount] = useState("N/A");

  const calCertRef = useRef(null);
  const traceCertRef = useRef(null);

  const [calCertFile, setCalCertFile] = useState(null);
  const [traceCertFile, setTraceCertFile] = useState(null);

  const [calCertNo, setCalCertNo] = useState(""); 
  const [calibratedBy, setCalibratedBy] = useState(""); 
  const [remark, setRemark] = useState(""); 
  const [verifiedBy, setVerifiedBy] = useState(""); 
  const [approvedBy, setApprovedBy] = useState(""); 

  const handleCalCertClick = () => {
    calCertRef.current.click(); 
  };

  const handleTraceCertClick = () => {
    traceCertRef.current.click(); 
  };

  const handleCalCertChange = (e) => {
    const file = e.target.files[0];
    console.log("Calibration Certificate File:", file);
    setCalCertFile(file);
  };

  const handleTraceCertChange = (e) => {
    const file = e.target.files[0];
    console.log("Traceability Certificate File:", file);
    setTraceCertFile(file);
  };

  const calculateNextCalibrationDate = (frequency, date) => {
    if (!frequency || !date) return ""; 

    const frequencyString = typeof frequency === 'string' ? frequency : String(frequency);
    const frequencyNumber = parseInt(frequencyString);
    const frequencyUnit = frequencyString.toLowerCase().includes("year") ? "years" : "months";

    const calDate = new Date(date); 

    if (frequencyUnit === "years") {
      calDate.setFullYear(calDate.getFullYear() + frequencyNumber);
    } else if (frequencyUnit === "months") {
      calDate.setMonth(calDate.getMonth() + frequencyNumber);
    }

    return calDate.toISOString().split("T")[0];
  };

  const handleFrequencyChange = (e) => {
    const frequency = e.target.value;
    setCalibrationFrequency(frequency);
    const nextDate = calculateNextCalibrationDate(frequency, calibrationDate);
    setNextCalibrationDate(nextDate);
  };

  const handleCalibrationDateChange = (e) => {
    const date = e.target.value;
    setCalibrationDate(date);
    const nextDate = calculateNextCalibrationDate(calibrationFrequency, date);
    setNextCalibrationDate(nextDate);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    
    formData.append("gauge_id", gauge.gauge_id_no);
    formData.append("calibration_frequency", calibrationFrequency);
    formData.append("calibration_date", calibrationDate);
    formData.append("next_calibration_date", nextCalibrationDate);
    formData.append("least_count", leastCount);
    formData.append("frequency", frequency);
    formData.append("calibration_certificate", calCertFile); 
    formData.append("traceability_certificate", traceCertFile); 
    formData.append("calibration_cert_no", calCertNo); 
    formData.append("calibrated_by", calibratedBy); 
    formData.append("remark", remark); 
    formData.append("verified_by", verifiedBy); 
    formData.append("approved_by", approvedBy);

    console.log("Form Data being sent:", Array.from(formData.entries()));

    try {
      const response = await axios.post(SUBMIT_CALIBRATION_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
      
      // Navigate back to the cal_hme_report page after successful submission
      navigate("/cal_hme_report"); // Adjust the path as necessary
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    }
  };

  useEffect(() => {
    const fetchLeastCountFrequency = async () => {
      try {
        const response = await axios.get(`${GET_LEAST_COUNT_FREQ_URL}?gauge_id=${gauge.gauge_id_no}`);
        console.log("API Response (Least Count and Frequency):", response.data);

        if (response.data) {
          setLeastCount(response.data.least_count || "N/A");
          setFrequency(response.data.frequency || "N/A");
        } else {
          console.error("Gauge not found");
        }
      } catch (error) {
        console.error("Error fetching least count and frequency:", error);
      }
    };

    const fetchLastCalibrationDate = async () => {
      try {
        const response = await axios.get(`${GET_CAL_DATE_URL}?gauge_id=${gauge.gauge_id_no}`);
        console.log("API Response (Calibration Date):", response.data);
  
        if (response.data.length > 0) {
          const { last_cal_date } = response.data[0];
          const formattedDate = last_cal_date.split("T")[0];
          setLastCalibrationDate(formattedDate); 
          setCalibrationDate(formattedDate); 
          const nextDate = calculateNextCalibrationDate(frequency, formattedDate);
          setNextCalibrationDate(nextDate);
        } else {
          console.error("No last calibration date found");
        }
      } catch (error) {
        console.error("Error fetching last calibration date:", error);
      }
    };

    if (gauge.gauge_id_no) {
      fetchLeastCountFrequency();
      fetchLastCalibrationDate();
    }
  }, [gauge.gauge_id_no, frequency]);

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

      {/* Calibration Report Content */}
      <div className="table-wrapper mx-auto">
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead>
              <tr>
                <th colSpan="2">
                  <p>
                    Industrial Engine Unit
                    <br />
                    L.E.U.-IV
                  </p>
                </th>
                <th colSpan="2">
                  <h2>GAUGE/INSTRUMENT/EQUIPMENT CALIBRATION CARD</h2>
                </th>
                <th colSpan="2">
                  <p>
                    DOC.No.: SD.3.01
                    <br />
                    REV.No.: 01
                  </p>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      {/* Calibration Info */}
      <div className="table-wrapper mx-auto">
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle w-100">
            <tbody>
              <tr>
                <td style={{ width: "20%" }}>
                  <p>Calibration Frequency:</p>
                </td>
                <td colSpan="3">
                  <p>{frequency}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Name of Gauge/Instrument/Equipment:</p>
                </td>
                <td>
                  <p>{gauge.gauges || "N/A"}</p>
                </td>
                <td>
                  <p>Size / Range:</p>
                </td>
                <td>
                  <input type="text" className="form-control" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>Least Count:</p>
                </td>
                <td>
                  <p>{leastCount}</p>
                </td>
                <td>
                  <p>Make:</p>
                </td>
                <td>
                  <input type="text" className="form-control" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>GCL ID:</p>
                </td>
                <td>
                  <input type="text" className="form-control" />
                </td>
                <td>
                  <p>Location:</p>
                </td>
                <td>
                  <p>{gauge.location || "N/A"}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Mfg.ID/Sr.No.:</p>
                </td>
                <td colSpan="3">
                  <p>{gauge.gauge_id_no || "N/A"}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Calibration Data Table */}
      <div className="table-wrapper mx-auto">
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle w-100">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>Date of Calibration</th>
                <th style={{ width: "15%" }}>Next Calibration Date</th>
                <th style={{ width: "20%" }}>Calibration Certificate No.</th>
                <th style={{ width: "10%" }}>Calibration Certificate Path</th>
                <th style={{ width: "10%" }}>Traceability Certificate Path</th>
                <th style={{ width: "15%" }}>Calibrated By</th>
                <th style={{ width: "15%" }}>Remark</th>
                <th style={{ width: "20%" }}>Verified By</th>
                <th style={{ width: "20%" }}>Approved By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    value={calibrationDate}
                    onChange={handleCalibrationDateChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={nextCalibrationDate}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={calCertNo}
                    onChange={(e) => setCalCertNo(e.target.value)} 
                  />
                </td>
                <td>
                  <button onClick={handleCalCertClick} className="btn btn-info">
                    <FaFolderOpen />
                  </button>
                  <input
                    ref={calCertRef}
                    type="file"
                    style={{ display: "none" }}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleCalCertChange}
                  />
                  <p>{calCertFile ? `Selected File: ${calCertFile.name}` : "No file selected."}</p>
                </td>
                <td>
                  <button onClick={handleTraceCertClick} className="btn btn-info">
                    <FaFolderOpen />
                  </button>
                  <input
                    ref={traceCertRef}
                    type="file"
                    style={{ display: "none" }}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleTraceCertChange}
                  />
                  <p>{traceCertFile ? `Selected File: ${traceCertFile.name}` : "No file selected."}</p>
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={calibratedBy}
                    onChange={(e) => setCalibratedBy(e.target.value)} 
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)} 
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={verifiedBy}
                    onChange={(e) => setVerifiedBy(e.target.value)} 
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={approvedBy}
                    onChange={(e) => setApprovedBy(e.target.value)} 
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Submission */}
      <div className="d-flex justify-content-center mt-4">
        <button onClick={handleSubmit} className="btn btn-success">
          Submit
        </button>
      </div>
    </div>
  );
};

export default CalReport;










