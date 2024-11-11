import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ADD_CAL_AGENCY_URL,
  ADD_GAUGE_TYPE_URL,
  GET_GAUGE_TYPE_URL,
  ADD_CAL_LOCATION_URL,
  ADD_CAL_STATUS_URL,
  ADD_GAUGE_DATA_URL,
  CAL_MAILER_NEWENTRY_URL,
  GET_CAL_MAILER_LIST_URL,
} from '../../../utils/apiUrls';

const NewEntryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTable } = location.state || {}; // Access selectedTable from state

  const [formData, setFormData] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [fieldNames, setFieldNames] = useState([]);
  const [gaugeTypes, setGaugeTypes] = useState([]); // Initialize as an empty array
  const [mailerList, setMailerList] = useState([]); // For mailer list

  // Fetch the Gauge Types only if 'data' is selected
  useEffect(() => {
    const fetchGaugeTypes = async () => {
      try {
        const response = await axios.get(GET_GAUGE_TYPE_URL);
        console.log('Gauge Types Response:', response.data);
        if (response.data && Array.isArray(response.data.values)) {
          const types = response.data.values.map(item => ({
            id: item.id, // Assuming your `id` is in the values array
            gauge_name: item.gauge_type // Use gauge_type from the values
          }));
          setGaugeTypes(types);
          console.log('Mapped Gauge Types:', types); // Log mapped gauge types
        } else {
          console.error('Unexpected response format:', response.data);
          setGaugeTypes([]);
        }
      } catch (error) {
        console.error('Error fetching gauge types:', error);
        setGaugeTypes([]);
      }
    };

    if (selectedTable === 'data') {
      fetchGaugeTypes(); // Only fetch gauge types if the selected table is 'data'
    }
  }, [selectedTable]);

  // Fetch the mailer list data if required (for act, informer, authenticator fields)
  useEffect(() => {
    const fetchMailerList = async () => {
      try {
        const response = await axios.get(GET_CAL_MAILER_LIST_URL);
        console.log('Mailer List Response:', response.data);
        if (response.data && Array.isArray(response.data.values)) {
          setMailerList(response.data.values); // Assuming `mail_id` is in the values
        } else {
          console.error('Unexpected response format for mailer list:', response.data);
          setMailerList([]);
        }
      } catch (error) {
        console.error('Error fetching mailer list:', error);
        setMailerList([]);
      }
    };

    // Fetch mailer list only if required (for specific fields)
    if (selectedTable === 'data' || selectedTable === 'status' || selectedTable === 'mailerlist') {
      fetchMailerList();
    }
  }, [selectedTable]);

  useEffect(() => {
    console.log("Selected Table:", selectedTable); // Check what value is passed for selectedTable

    switch (selectedTable) {
      case 'calibration':
        setFieldNames([
          { name: 'cal_agency', label: 'Calibration Agency' },
          { name: 'name', label: 'Name' },
          { name: 'address', label: 'Address' },
          { name: 'city', label: 'City' },
          { name: 'contact1', label: 'Contact 1' },
          { name: 'contact2', label: 'Contact 2' }
        ]);
        break;
      case 'gauge':
        setFieldNames([
          { name: 'gauge_type', label: 'Gauge Type' }
        ]);
        break;
      case 'location':
        setFieldNames([
          { name: 'location', label: 'Location' },
          { name: 'name', label: 'Name' },
          { name: 'address', label: 'Address' },
          { name: 'contact_person1', label: 'Contact Person 1' },
          { name: 'contact_person2', label: 'Contact Person 2' },
          { name: 'contactp_mail1', label: 'Contact Person Mail 1' },
          { name: 'contactp_mail2', label: 'Contact Person Mail 2' },
        ]);
        break;
      case 'status':
        setFieldNames([
          { name: 'gauge_id', label: 'Gauge Id' },
          { name: 'cal_agency', label: 'Cal Agency' },
          { name: 'lat_cal_date', label: 'Last Calibration Date' },
          { name: 'cal_certificate_no', label: 'Calibration Certificate No' },
          { name: 'cal_certificate_fpath', label: 'Calibration Certificate File Path' },
          { name: 'calibrated_by', label: 'Calibrated By' },
          { name: 'remark', label: 'Remark' },
          { name: 'verified_by', label: 'Verified By' },
          { name: 'approved_by', label: 'Approved By' },
          { name: 'Id', label: 'Id' }
        ]);
        break;
      case 'data':
        setFieldNames([
          { name: 'gauge_id_no', label: 'Gauge Id No' },
          { name: 'gauges', label: 'Gauge Type' },
          { name: 'unit', label: 'Unit' },
          { name: 'std_size', label: 'Std Size' },
          { name: 'min_size', label: 'Min Size' },
          { name: 'max_size', label: 'Max Size' },
          { name: 'go', label: 'Go' },
          { name: 'nogo', label: 'No go' },
          { name: 'std_tolerance', label: 'Std Tolerance' },
          { name: 'min_tolerance', label: 'Min Tolerance' },
          { name: 'max_tolerance', label: 'Max Tolerance' },
          { name: 'min_range', label: 'Min Range' },
          { name: 'max_range', label: 'Max Range' },
          { name: 'least_count', label: 'Least Count' },
          { name: 'min_acc', label: 'Min Acceleration' },
          { name: 'max_acc', label: 'Max Acceleration' },
          { name: 'location', label: 'Location' },
          { name: 'frequency', label: 'Frequency' },
          { name: 'act_1', label: 'Act 1' },
          { name: 'act_2', label: 'Act 2' },
          { name: 'act_3', label: 'Act 3' },
          { name: 'informer_1', label: 'Informer 1' },
          { name: 'informer_2', label: 'Informer 2' },
          { name: 'informer_3', label: 'Informer 3' },
          { name: 'authenticator_1', label: 'Authenticator 1' },
          { name: 'authenticator_2', label: 'Authenticator 2' }
        ]);
        break;
      case 'mailerlist':
        setFieldNames([
          { name: 'mail_id', label: 'Mail Id' },
          { name: 'name', label: 'Name' },
        ]);
        break;
      default:
        setFieldNames([]);
        break;
    }

  }, [selectedTable]);

  useEffect(() => {
    console.log("Field Names updated:", fieldNames); // Log the field names when updated
  }, [fieldNames]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field Changed: ${name} = ${value}`);

    if (name === 'gauges') {
      const selectedGauge = gaugeTypes.find(gauge => gauge.id === parseInt(value));
      setFormData((prevData) => ({
        ...prevData,
        gauge_type_id: selectedGauge ? selectedGauge.id : '',
        gauges: selectedGauge ? selectedGauge.gauge_name : '',  // Store gauge_type_id in formData
      }));
    } else if (name === 'frequency') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10), // Parse the input as an integer
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedTable === 'data' && isNaN(formData.frequency)) {
      setResponseMessage('Frequency must be a valid number.');
      return;
    }

    let url;
    switch (selectedTable) {
      case 'calibration':
        url = ADD_CAL_AGENCY_URL;
        break;
      case 'gauge':
        url = ADD_GAUGE_TYPE_URL;
        break;
      case 'location':
        url = ADD_CAL_LOCATION_URL;
        break;
      case 'status':
        url = ADD_CAL_STATUS_URL;
        break;
      case 'data':
        url = ADD_GAUGE_DATA_URL;
        break;
      case 'mailerlist':
        url = CAL_MAILER_NEWENTRY_URL;
        break;
      default:
        console.error('Unknown table:', selectedTable);
        return;
    }

    try {
      const response = await axios.post(url, formData);
      setResponseMessage(response.data.message || 'Data added successfully!');
      console.log('Response:', response);
      navigate('/success'); // Navigate to success page after submission
    } catch (error) {
      console.error('Error submitting data:', error);
      setResponseMessage('Failed to add data.');
    }
  };

  return (
    <div className="container">
      <h1>New Entry Form for {selectedTable}</h1>
      <form onSubmit={handleSubmit}>
        {fieldNames.map((field, index) => (
          <div className="mb-3" key={index}>
            <label className="form-label">{field.label}</label>
            {field.name === 'gauges' ? (
              <select name={field.name} onChange={handleChange} className="form-control">
                <option value="">Select Gauge</option>
                {gaugeTypes.map((gauge) => (
                  <option key={gauge.id} value={gauge.id}>
                    {gauge.gauge_name}
                  </option>
                ))}
              </select>
            ) : field.name === 'mail_id' || field.name === 'name' ? (
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="form-control"
              />
            )}
          </div>
        ))}

        <div className="mb-3">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>

      {responseMessage && <div className="alert alert-info">{responseMessage}</div>}
    </div>
  );
};

export default NewEntryForm;
