import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../main_pg/Header';
import Footer from '../main_pg/Footer';
import NavBar from '../main_pg/Nav_Bar';
import Home from './home';
import About from './about';
import Operation from './operations';
import Spare from './spare_01';
import CalAgencyTable from '../quality/cal_agency_table';
import Hmechecksheet from '../atp/pg_hme_checksheet';
import UpdateDB from '../atp/database';
import User from '../user_list/user';
import '../../csspage/styles.css';
import Logout from '../common/logout';
import CalHmeReport from '../quality/cal_hme_report';
import CalMailerList from '../quality/cal_mailer_list';
import CalDashboard from '../quality/cal_dashboard';
// import Table from '../quality/table';

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;

  const pages = {
    '/home': <Home />,
    '/about': <About />,
    '/hme_checksheet': <Hmechecksheet />,
    '/spare': <Spare />,
    '/operations': <Operation />,
    '/updatedatabase': <UpdateDB />,
    '/user': <User />,
    '/logout': <Logout />,
    '/cal_agency_table': <CalAgencyTable />,
    '/cal_hme_report': <CalHmeReport />,
    '/cal_mailer_list': <CalMailerList />,
    '/cal_dashboard': <CalDashboard />
    // '/table' : <Table/>
    // Add more routes here
  };

  const activeTab = pages[pathname] ? pathname : '/home'; // Default to '/home' if the path is not recognized

  return (
    <div className="container-fluid">
      <div className="row" style={{ textAlign: 'center' }}>
        <Header />
      </div>
      <div className="row flex-grow-1 separator main-content">
        <div className="col-lg-2 col-md-2 col-sm-2 separator_vt">
          <NavBar />
        </div>
        <div className="col-lg-10 col-md-10 col-sm-10" style={{ paddingLeft: 0 }}>
          <div className="content-wrapper" style={{ textAlign: 'center' }}>
            {pages[activeTab]}
          </div>
        </div>
      </div>
      <div className="separator">
      </div>
      <div className="row scrolling-text" style={{ textAlign: 'center' }}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
