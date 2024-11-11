import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Layout from './component/htmlpage/common/master_layout';
import Home from './component/htmlpage/common/home';
import Logout from './component/htmlpage/common/logout';
import About from './component/htmlpage/common/about';
import Login from './component/htmlpage/common/login';
import Operation from './component/htmlpage/common/operations';
import Spare from './component/htmlpage/common/spare_01';
import User from './component/htmlpage/user_list/user';
import Hmechecksheet from './component/htmlpage/atp/pg_hme_checksheet';
import OpenChecksheet from './component/htmlpage/atp/checksheetform';
import Resultchecksheet from './component/htmlpage/atp/resultchecksheet';
import Auditchecksheet from './component/htmlpage/atp/auditchecksheet';
import Reworkchecksheet from './component/htmlpage/atp/reworkchecksheet';
import UpdateBD from './component/htmlpage/atp/database';
import NewTabPage from './component/htmlpage/atp/NewTabPage';
import NewEntrySheet from './component/htmlpage/atp/newentrysheet';
import UserNewEntry from './component/htmlpage/user_list/usernewentry';
import UserEditEntry from './component/htmlpage/user_list/usereditentry';
import Assemblyop from './component/htmlpage/atp/assemblyop';
import NewPage from './component/htmlpage/atp/newpage';
import Assemblyopresult from './component/htmlpage/atp/assemblyopresult'
import CalAgencyTable from './component/htmlpage/quality/cal_agency_table'; // Adjust the path accordingly

import NewEntryForm from './component/htmlpage/quality/cal_agency_newentry';
import CalReport from './component/htmlpage/quality/cal_report';
import CalHmeReport from './component/htmlpage/quality/cal_hme_report';
import CalReportResult from './component/htmlpage/quality/cal_view_report';
// import CalMailerList from './component/htmlpage/quality/cal_mailer_list';
// import CreateMailerEntry from './component/htmlpage/quality/cal_mailer_newentry';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
    
      <Routes>
        <Route 
          path="/"
          element={isLoggedIn ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />}
        />

        <Route path="/home" element={isLoggedIn ? <Layout><Home /></Layout> : <Navigate to="/" replace />} />
        <Route path="/home"  element={<Home />} />


        <Route path="/about" element={isLoggedIn ? <Layout><About /></Layout> : <Navigate to="/" replace />} />
        <Route path="/spare" element={isLoggedIn ? <Layout><Spare /></Layout> : <Navigate to="/" replace />} />
        <Route path="/operations" element={isLoggedIn ? <Layout><Operation /></Layout> : <Navigate to="/" replace />} />


        <Route path="/hme_checksheet" element={isLoggedIn ? <Layout><Hmechecksheet /></Layout> : <Navigate to="/" replace />} />
        {/* <Route path="/hme_checksheet" element={<Hmechecksheet />} /> */}

        <Route path="/updatedatabase" element={isLoggedIn ? <Layout><UpdateBD /></Layout> : <Navigate to="/" replace />} />
        <Route path="/user" element={isLoggedIn ? <Layout><User /></Layout> : <Navigate to="/" replace />} />
        <Route path="/cal_agency_table" element={isLoggedIn ? <Layout><CalAgencyTable /></Layout> : <Navigate to="/" replace />} />
        <Route path="/cal_hme_report" element={isLoggedIn ? <Layout><CalHmeReport /></Layout> : <Navigate to="/" replace />} />

        {/* <Route path="/cal_hme_report"  element={<CalHmeReport />} /> */}

        <Route path="/newtab" element={<NewTabPage />} />
        <Route path="/openchecksheet" element={<OpenChecksheet />} />
        <Route path="/resultchecksheet" element={<Resultchecksheet />} />
        <Route path="/auditchecksheet" element={<Auditchecksheet />} />
        <Route path="/reworkchecksheet" element={<Reworkchecksheet />} />
        <Route path="/new_entrysheet" element={<NewEntrySheet />} />
        <Route path="/user_newentry" element={<UserNewEntry />} />
        <Route path="/user_editentry" element={<UserEditEntry />} />
        <Route path="/assemblyop" element={<Assemblyop />} />
        <Route 
          path="/logout" 
          element={<Logout onLogout={handleLogout} />} 
        />
        <Route path="/" element={<Assemblyop />} />
        <Route path="/new-page" element={<NewPage />} />
        <Route path="/assemblyopresult" element={<Assemblyopresult />} />
        <Route path="/cal_agency_newentry" element={<NewEntryForm />} />
        <Route path="/create-new-calibration" element={<NewEntryForm selectedTable="calibration" />} />
        <Route path="/create-new-gauge" element={<NewEntryForm selectedTable="gauge" />} />
        <Route path="/create-new-location" element={<NewEntryForm selectedTable="location" />} />
        <Route path="/create-new-status" element={<NewEntryForm selectedTable="status" />} />
        <Route path="/create-new-data" element={<NewEntryForm selectedTable="data" />} />
        <Route path="/cal_report" element={<CalReport />} />
        <Route path="/cal_view_report" element={<CalReportResult />} />
        {/* <Route path="/cal_mailer_list" element={<CalMailerList />} />
        <Route path="/cal_mailer_newentry" element={<CreateMailerEntry />} /> */}
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;