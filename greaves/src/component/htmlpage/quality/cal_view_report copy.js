import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../csspage/cal_report.css"; 
import { useLocation } from "react-router-dom"; 
import axios from "axios"; 
import { GET_CAL_STATUS_URL, GET_LEAST_COUNT_FREQ_URL,GET_CAL_DATE_URL } from "../../../utils/apiUrls"; // Ensure this URL is correct

const CalReportResult = () => {
    const { state } = useLocation(); 
    const gauge = state?.gauge || {};
  
    // State variables for fetched data
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
      const fetchCalibrationData = async () => {
        try {
          const response = await axios.get(`${GET_CAL_STATUS_URL}?gauge_id=${gauge.gauge_id_no}`);
          const data = response.data;
  
          if (data) {
            setCalibrationDate(data.last_cal_date || "N/A");
            setNextCalibrationDate(data.next_cal_date || "N/A");
            setCalCertPath(data.cal_certificate_fpath || "N/A");
            setTraceCertPath(data.tracebility_cert_path || "N/A");
            setRemark(data.remark || "N/A");
            setVerifiedBy(data.verified_by || "N/A");
            setApprovedBy(data.approved_by || "N/A");
          } else {
            console.error("Calibration data not found");
          }
        } catch (error) {
          console.error("Error fetching calibration data:", error);
        }
      };
  
      if (gauge.gauge_id_no) {
        fetchCalibrationData();
      }
    }, [gauge.gauge_id_no]);

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
                  <p>Industrial Engine Unit<br />L.E.U.-IV</p>
                </th>
                <th colSpan="2">
                  <h2>GAUGE/INSTRUMENT/EQUIPMENT CALIBRATION CARD</h2>
                </th>
                <th colSpan="2">
                  <p>DOC.No.: SD.3.01<br />REV.No.: 01</p>
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
                <th>Date of Calibration</th>
                <th>Next Calibration Date</th>
                <th>Calibration Certificate Path</th>
                <th>Traceability Certificate Path</th>
                <th>Remark</th>
                <th>Verified By</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{calibrationDate}</td>
                <td>{nextCalibrationDate}</td>
                <td>{calCertPath}</td>
                <td>{traceCertPath}</td>
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
