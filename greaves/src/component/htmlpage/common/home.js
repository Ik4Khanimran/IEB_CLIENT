//final code


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../csspage/home.css';
import { HOME_GET_DATA_URL } from '../../../utils/apiUrls';
import { HOME_DOWNLOAD_DATA_URL } from '../../../utils/apiUrls';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from 'xlsx';
import { Carousel } from 'react-bootstrap'; // Import Carousel component

const Home = () => {
  const [data_xcl, setData_Xcl] = useState([]);
  const [data_csr, setData_CSR] = useState([]);
  const [data_test, setData_Test] = useState([]);
  const [data_assly, setData_Assly] = useState([]);
  const [dataset_01, setDataset_01] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedBom, setSelectedBom] = useState(''); // State for selected BOM
  const [selectedESN, setSelectedESN] = useState('');
  const [selectedArea, setSelectedArea] = useState("Assembly");
  const handleAreaSelection = (event) => setSelectedArea(event.target.value);
  const [activeIndex, setActiveIndex] = useState(0);

  const [searchText, setSearchText] = useState("");
  const hasFetchedData = useRef(false);

  // Fetch data from API
  const fetchData = async (year, month) => {
    try {
      const response = await axios.post(HOME_GET_DATA_URL, { year, month });
      if (response.data.status === "success") {
        console.log('API Response:', response.data);
        setData_Xcl(response.data.data_xcl);
        setData_CSR(response.data.data_csr);
        setData_Test(response.data.data_test);  // Ensure correct field names
        setData_Assly(response.data.data_assly);  // Ensure correct field names
        setDataset_01(response.data.dataset_01);
      } else {
        console.error("API request failed:", response.data.message);
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      fetchData(currentYear, currentMonth);
      hasFetchedData.current = true;
    }

    // Set up periodic updates
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      fetchData(currentYear, currentMonth);
      console.log('Data refreshed at:', new Date());
    }, 30000); // Update every 30 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);


  const handleDateChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      setStartDate(date);
      fetchData(year, month);
    }
  };

  const prepareChartData = () => {
    const esnCountMap = new Map();
    data_csr.forEach(item => {
      const date = item.timestamp.split('T')[0];
      const dayNumber = new Date(date).getDate();
      esnCountMap.set(dayNumber, (esnCountMap.get(dayNumber) || 0) + 1);
    });

    const chartData = Array.from(esnCountMap, ([dayNumber, engine_count]) => ({
      dayNumber,
      "No of Engines": engine_count
    }));

    console.log('CSR Chart Data:', chartData);
    return chartData;
  };
  //  Chart for assembly
  const prepareAsslyChartData = () => {
    const esnCountMap = new Map();
    data_assly.forEach(item => {
      const date = item.timestamp.split('T')[0];
      const dayNumber = new Date(date).getDate();
      esnCountMap.set(dayNumber, (esnCountMap.get(dayNumber) || 0) + 1);
    });

    const chartData = Array.from(esnCountMap, ([dayNumber, engine_count]) => ({
      dayNumber,
      "No of Engines": engine_count
    }));

    console.log('Assembly Chart Data:', chartData);
    return chartData;
  }; 
  
  // Chart for Test
  const prepareTestChartData = () => {
    const esnCountMap = new Map();
    data_test.forEach(item => {
      const date = item.st20_date.split('T')[0];
      const dayNumber = new Date(date).getDate();
      esnCountMap.set(dayNumber, (esnCountMap.get(dayNumber) || 0) + 1);
    });

    const chartData = Array.from(esnCountMap, ([dayNumber, engine_count]) => ({
      dayNumber,
      "No of Engines": engine_count
    }));

    console.log('Testing Chart Data:', chartData);
    return chartData;
  };

  // Handle carousel selection
  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex); // Update activeIndex based on carousel selection
  };

  // const prepareChartData = (data) => {
  //   const esnCountMap = new Map();
  //   data.forEach(item => {
  //     const date = item.timestamp.split('T')[0];
  //     const dayNumber = new Date(date).getDate();
  //     esnCountMap.set(dayNumber, (esnCountMap.get(dayNumber) || 0) + 1);
  //   });

  //   return Array.from(esnCountMap, ([dayNumber, engine_count]) => ({
  //     dayNumber,
  //     "No of Engines": engine_count
  //   }));
  // };

  const handleDownloadExcel = async () => {
    try {
      let dataToDownload = [];
      console.log('Active Index:', activeIndex); 

      // Determine which data to download based on active index
      if (activeIndex === 0) {
        console.log("Downloading CSR data: ", dataToDownload);
        dataToDownload = data_csr;  // CSR data
      } else if (activeIndex === 1) {
        dataToDownload = data_assly;  // Assembly data
        console.log("Downloading Assembly data: ", dataToDownload);
      } else if (activeIndex === 2) {
        dataToDownload = data_test;  // Test data
        console.log("Downloading Test data: ", dataToDownload);
      }

      if (dataToDownload.length === 0) {
        alert("No data available for download.");
        return;
      }

      // Format the data for Excel
      const formattedData = dataToDownload.map(item => ({
        ESN: item.esn,
        Timestamp: item.timestamp,
        BOM: item.bom_srno_id__bom,
      }));

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Create a workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Export the workbook as a file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // Create a Blob from the Excel buffer
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

      // Generate a download link and trigger the download
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", "data.xlsx"); // Set the desired file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download the file. Please try again.");
    }
  };
  

  // Filter dataset_01 based on selected BOM
  const filteredDataset = selectedBom
  ? dataset_01.filter(item => item.bom === selectedBom)
  : dataset_01;

  // Initialize locCounts with all location values set to 0
  const locCounts = {
  1: 0, 2: 0, 5: 0, 10: 0, 12: 0, 14: 0, 20: 0, 22: 0, 24: 0, 30: 0, 32: 0, 35: 0, 40: 0, 42: 0,
  };

  // Populate the locCounts object with data from filteredDataset
  filteredDataset.forEach(item => {
  if (item.cur_loc in locCounts) {
    locCounts[item.cur_loc] += item.count || 0; // Default to 0 if count is missing
  }
  });

  const handleSearchChange = (e) => {
    setSearchText(e.target.value); // Update the search text
  };

  const filteredBoms = Array.from(new Set(dataset_01.map(item => item.bom)))
    .filter(bom => bom.toLowerCase().includes(searchText.toLowerCase())); // Filter BOMs based on search text

  // Function to export data to Excel
  const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, filename);
  };

  // Extract values for display
  const V_PPC = locCounts[1];
  const V_Store = locCounts[2];
  const V_Trolley = locCounts[5];
  const V_A_Inprocess = locCounts[10];
  // const V_A_Rework = locCounts[12];
  const V_A_Rework = 15;
  const V_A_Quality = locCounts[14];
  const V_T_Inprocess = locCounts[20];
  // const V_T_Rework = locCounts[22];
  const V_T_Rework = 17;
  const V_T_Quality = locCounts[24]; 
  // const V_CSR_Inprocess = locCounts[30];
  const V_CSR_Inprocess = 25;
  const V_CSR_Rework = 13;
  const V_CSR_Qualitycheck = 0;
  // const V_CSR_Rework = locCounts[32];
  // const V_CSR_Qualitycheck = locCounts[35];
  // const V_Packaging_Inprocess = locCounts[40];
  const V_Packaging_Inprocess = 2;
  // const V_FG = locCounts[42];
  const V_FG =0;

  return (
    <div>       
      <div className="row" >
        <div className="col-lg-12 col-md-12 col-sm-12 mb-12">
          <h4>DASHBOARD</h4>
        </div>
      </div>
      
      <div className="row" >
        <div className="col-lg-12 col-md-4 col-sm-4 mb-4">
          {/* Dropdown to select BOM */}
            <label htmlFor="bom-search">Search or Select BOM:</label>
      
            {/* Search input to filter the dropdown */}
            <input
              type="text"
              id="bom-search"
              placeholder="Type to search"
              value={searchText}
              onChange={handleSearchChange}
              autoComplete="off" // Disable the browser's autocomplete
            />
      
            {/* Dropdown with filtered options */}
            <select
              id="bom-select"
              onChange={(e) => setSelectedBom(e.target.value)}
              value={selectedBom}
            >
              <option value="">Select BOM</option>
              {filteredBoms.map((bom) => (
                <option key={bom} value={bom}>
                  {bom}
                </option>
              ))}
            </select>
        <div>
    </div>
 
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2 col-md-2 col-sm-2 mb-2 card h-50">
            <div className="card-body">
              <h5 className="card-title">Trolley Ready</h5>
              <p className="card-text">{V_Trolley}</p>
            </div>
        </div>
        
        <div className="col-lg-6 col-md-6 col-sm-6 mb-6 table-responsive" style={{ paddingTop: '0', marginTop: '0' }}>
            <table className="table table-bordered table-sm">
              <thead className="thead-dark" >
                <tr>
                  <th>Status</th>
                  <th>Assembly</th>
                  <th>Testing</th>
                  <th>CSR</th>
                </tr>
              </thead>
              <tbody >
                <tr>
                  <td style={{ textAlign: 'center' }}>In process</td>
                  <td style={{ textAlign: 'center' }}>{V_A_Inprocess}</td>
                  <td style={{ textAlign: 'center' }}>{V_T_Inprocess}</td>
                  <td style={{ textAlign: 'center' }}>{V_CSR_Inprocess}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>Hold</td>
                  <td style={{ textAlign: 'center' }}>{V_A_Rework}</td>
                  <td style={{ textAlign: 'center' }}>{V_T_Rework}</td>
                  <td style={{ textAlign: 'center' }}>{V_CSR_Rework}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>Quality</td>
                  <td style={{ textAlign: 'center' }}>{V_A_Quality}</td>
                  <td style={{ textAlign: 'center' }}>{V_T_Quality}</td>
                  <td style={{ textAlign: 'center' }}>{V_CSR_Qualitycheck}</td>
                </tr>
              </tbody>
            </table>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-2 mb-2 card h-50">
            <div className="card-body">
              <h5 className="card-title">Packaging</h5>
              <p className="card-text">{V_Packaging_Inprocess}</p>
            </div>
        </div>    

        <div className="col-lg-2 col-md-2 col-sm-2 mb-2 card h-50">
            <div className="card-body">
              <h5 className="card-title">Finish Goods</h5>
              <p className="card-text">{V_FG}</p>
            </div>
        </div>
      </div>


      <div className="row" style={{
        display: 'flex',          
        justifyContent: 'center', 
        alignItems: 'center',     
        height: '10vh',          
       }}>
        <div className="col-lg-2 col-md-2 col-sm-2 mb-2" style={{
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center', // Center the DatePicker within the column
          marginBottom: '20px'
        }}>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="datepicker"
          />
      </div>
    </div>
      

      <div style={{ width: '100%', overflowX: 'auto' }}>
      <Carousel
        activeIndex={activeIndex}
        onSelect={(index) => setActiveIndex(index)}
        interval={null} // Disable auto-scrolling
        pause="hover"   // Optional: Pause the auto-scrolling when hovering over the carousel
        >
        <Carousel.Item>
        <div style={{ textAlign: 'center', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              left: 80,
              top: -5,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '18px',
              textAlign: 'center',
              writingMode: 'horizontal-tb',
              backgroundColor: 'transparent',
            }}
          >
            Monthly production from Assembly
          </div>
          <div style={{ paddingLeft: '50px', width: 'fit-content' }}>
            <BarChart width={window.innerWidth * 0.7} height={300} data={prepareAsslyChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dayNumber" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="No of Engines" fill="#82ca9d">
                <LabelList dataKey="No of Engines" position="top" />
              </Bar>
            </BarChart>
            <button
              style={{
                position: 'absolute',
                bottom: '-2px',
                left: '60%',
                transform: 'translateX(-50%)',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                fontSize: '12px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={() => exportToExcel(data_assly, 'assembly_data.xlsx')}
            >
              Download Data
            </button>
          </div>
        </div>
        </Carousel.Item>

        <Carousel.Item>
        <div style={{ textAlign: 'center', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              left: 80,
              top: -5,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '18px',
              textAlign: 'center',
              writingMode: 'horizontal-tb',
              backgroundColor: 'transparent',
            }}
          >
            Monthly production from Testing
          </div>
          <BarChart width={window.innerWidth * 0.7} height={300} data={prepareTestChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dayNumber" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="No of Engines" fill="#d0a9f5">
              <LabelList dataKey="No of Engines" position="top" />
            </Bar>
          </BarChart>
          <button
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: '60%',
              transform: 'translateX(-50%)',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              fontSize: '12px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => exportToExcel(data_test, 'testing_data.xlsx')}
          >
            Download Data
          </button>
        </div>
        </Carousel.Item>

        <Carousel.Item>
        <div style={{ textAlign: 'center', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              left: 80,
              top: -5,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '18px',
              textAlign: 'center',
              writingMode: 'horizontal-tb',
              backgroundColor: 'transparent',
            }}
          >
            Monthly production from CSR
          </div>
          <BarChart width={window.innerWidth * 0.7} height={300} data={prepareChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dayNumber" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="No of Engines" fill="#8884d8">
              <LabelList dataKey="No of Engines" position="top" />
            </Bar>
          </BarChart>
          <button
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: '60%',
              transform: 'translateX(-50%)',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              fontSize: '12px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => exportToExcel(data_csr, 'csr_data.xlsx')}
          >
            Download Data
          </button>
        </div>
        </Carousel.Item>
        </Carousel>

      </div>

    </div>
  );
};

export default Home;