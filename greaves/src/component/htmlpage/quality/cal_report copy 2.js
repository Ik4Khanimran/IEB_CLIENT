import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../csspage/cal_report.css";
import { FaFolderOpen } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { GET_LEAST_COUNT_FREQ_URL, GET_CAL_DATE_URL, SUBMIT_CALIBRATION_URL, GET_LOCATION_GNAME_URL } from "../../../utils/apiUrls";

const CalReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gauge, setGauge] = useState({});
  const [calibrationFrequency, setCalibrationFrequency] = useState(""); 
  const [calibrationDate, setCalibrationDate] = useState(""); 
  const [nextCalibrationDate, setNextCalibrationDate] = useState(""); 
  const [lastCalibrationDate, setLastCalibrationDate] = useState(""); 
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
    const queryParams = new URLSearchParams(location.search);
    const gaugeId = queryParams.get("gaugeId");
    console.log("Extracted Gauge ID:", gaugeId);
  
    if (gaugeId) {
      const fetchGaugeDetails = async () => {
        try {
          // First API call to get least count and frequency
          const response = await axios.get(`${GET_LEAST_COUNT_FREQ_URL}?gauge_id=${gaugeId}`);
          console.log("API Response (Gauge Details):", response.data);
  
          if (response.data) {
            setLeastCount(response.data.least_count || "N/A");
            setFrequency(response.data.frequency ? `${response.data.frequency} months` : "N/A");
          } else {
            console.error("Gauge data not found in API response");
            setLeastCount("N/A");
            setFrequency("N/A");
          }
          
          // Second API call to get gauge name and location
          const locationResponse = await axios.get(`${GET_LOCATION_GNAME_URL}?gauge_id=${gaugeId}`);
          console.log("API Response (Gauge Name and Location):", locationResponse.data);
  
          if (locationResponse.data) {
            setGauge({
              gauge_name: locationResponse.data.gauges || "N/A",  // Updated to match the key in the API response
              location: locationResponse.data.location || "N/A",  // Location is correctly mapped
              gauge_id_no: gaugeId || "N/A",  // Assuming you can use the extracted gaugeId as gauge_id_no if not present in the response
            });
          } else {
            console.error("Gauge name and location not found in API response");
            setGauge({
              gauge_name: "N/A",
              location: "N/A",
              gauge_id_no: "N/A",
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setGauge({
            gauge_name: "N/A",
            location: "N/A",
            gauge_id_no: "N/A",
          });
          setLeastCount("N/A");
          setFrequency("N/A");
        }
      };

    const fetchLastCalibrationDate = async () => {
      try {
        const response = await axios.get(`${GET_CAL_DATE_URL}?gauge_id=${gaugeId}`);
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

    fetchGaugeDetails();
    fetchLastCalibrationDate();
  }
}, [location.search, frequency]);

  return (
    <div className="container calibration-report">
      <header className="text-center mb-3">
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
          <table className="table table-bordered text-center align-middle" style={{ tableLayout: "fixed", marginBottom: "-10px" }}>
            <thead>
              <tr>
                <th colSpan="1">
                  <p>
                    Industrial Engine Unit
                    <br />
                    L.E.U.-IV
                  </p>
                </th>
                <th colSpan="2">
                  <h2>GAUGE/INSTRUMENT/EQUIPMENT CALIBRATION CARD</h2>
                </th>
                <th colSpan="1">
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

      {/* Calibration Info Table */}
      <div className="table-wrapper mx-auto">
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle" style={{ tableLayout: "fixed", marginBottom: "0px" }}>
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
                  <p>{gauge.gauge_name || "N/A"}</p>
                </td>
                <td>
                  <p>Size / Range:</p>
                </td>
                <td>
                  <input type="text" className="form-control form-control-sm" />
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
                  <input type="text" className="form-control form-control-sm" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>GCL ID:</p>
                </td>
                <td>
                  <input type="text" className="form-control form-control-sm" />
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
          <table className="table table-bordered text-center align-middle" style={{ tableLayout: "fixed", marginBottom: "0px" }}>
            <thead>
              <tr>
                <th>Date of Calibration</th>
                <th>Next Calibration Date</th>
                <th>Calibration Certificate No.</th>
                <th>Calibration Certificate Path</th>
                <th>Traceability Certificate Path</th>
                <th>Calibrated By</th>
                <th>Remark</th>
                <th>Verified By</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={calibrationDate}
                    onChange={handleCalibrationDateChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={nextCalibrationDate}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={calCertNo}
                    onChange={(e) => setCalCertNo(e.target.value)} 
                  />
                </td>
                <td>
                  <button onClick={handleCalCertClick} className="btn btn-info btn-sm">
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
                  <button onClick={handleTraceCertClick} className="btn btn-info btn-sm">
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
                    className="form-control form-control-sm"
                    value={calibratedBy}
                    onChange={(e) => setCalibratedBy(e.target.value)} 
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)} 
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={verifiedBy}
                    onChange={(e) => setVerifiedBy(e.target.value)} 
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-sm"
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
        <button onClick={handleSubmit} className="btn btn-success btn-sm">
          Submit
        </button>
      </div>
    </div>
  );
};

export default CalReport;
