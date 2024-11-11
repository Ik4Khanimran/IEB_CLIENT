// apiUrls.js 

const MAIN_DOMAIN = 'http://127.0.0.1:8000';
//const MAIN_DOMAIN = 'http://localhost:81';
// const MAIN_DOMAIN = 'http://10.24.0.104:81';           //build
// const MAIN_DOMAIN = 'http://localhost:8000';

const APP_NAMES = {
  ATP: 'ATP',
  User: 'User',
  Common: 'Common',
  Dashboard: 'Dashboard',
  Operations : 'Operations',
  Quality : 'Quality'
};

export const LOGIN_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/login/`;
export const DATA_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/opn_checksheet/`;
export const CHECKSHEET_FORM2_SUBMIT_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/checksheet_data/`;
export const CHECKSHEET_RESULT_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/engine_checksheet_result/`;
export const DATABASE_CON_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/database_connection/`;
export const DATA_DELETE_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/data_delete/`;
export const DATA_EDIT_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/data_edit/`;
export const NEW_ENTRY_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/data_new_entry/`;
export const SAVE_ENTRY_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/save_new_entry/`;
export const CHECKSHEET_DROPDOWNVALUE_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/get_drdwn_val/`;
export const DATABASE_USER_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/usertable/`;
export const USER_DATA_DELETE_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/createusertable/`;
export const USER_NEW_ENTRY_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/createusertable/`;
export const SAVE_USER_ENTRY_URL = `${MAIN_DOMAIN}/${APP_NAMES.User}/save_new_entry/`;
export const HOME_GET_DATA_URL = `${MAIN_DOMAIN}/${APP_NAMES.Dashboard}/get_data/`;
export const AUDIT_REMARK_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/audit_checksheet/`;
export const OPN_CHECKSHEET_AUDIT_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/opn_audit_checksheet/`;
export const REWORK_REMARK_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/rework_checksheet/`;
export const OPN_CHECKSHEET_REWORK_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/opn_rework_checksheet/`;
export const GET_ESN_DETAIL_URL = `${MAIN_DOMAIN}/${APP_NAMES.Operations}/get_esn_data/`;
export const UPDATE_LOCATION_URL = `${MAIN_DOMAIN}/${APP_NAMES.Operations}/update_location/`;
export const OPEN_OPS_ST10_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/opn_ops_st10/`;
export const SUBMIT_OPS_ST10_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/assemblyop_submit/`;
export const GET_ASSEMBLYOP_DATA_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/get_assemblyop_result/`;
export const HOLD_OPS_ST10_URL = `${MAIN_DOMAIN}/${APP_NAMES.ATP}/assemblyop_hold/`;
// export const ADD_CAL_AGENCY_URL = '${MAIN_DOMAIN}/add_cal_agency/';
export const ADD_CAL_AGENCY_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/add_cal_agency/`;
export const GET_CAL_AGENCY_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_cal_agencies/`;
export const DELETE_CAL_AGENCY_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/delete_cal_agency/`;
export const UPDATE_CAL_AGENCY_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/edit_cal_agency/`; 

export const ADD_GAUGE_TYPE_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/add_gauge_type/`;
export const GET_GAUGE_TYPE_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_gauge_type/`;
export const DELETE_GAUGE_TYPE_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/delete_gauge_type/`;
export const UPDATE_GAUGE_TYPE_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/edit_gauge_type/`;

export const ADD_CAL_LOCATION_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/add_location/`;
export const GET_CAL_LOCATION_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_location/`;
export const DELETE_CAL_LOCATION_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/delete_location/`;
export const UPDATE_CAL_LOCATION_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/edit_location/`;

export const ADD_CAL_STATUS_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/add_cal_status/`;
export const GET_CAL_STATUS_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_cal_status/`;
export const DELETE_CAL_STATUS_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/delete_cal_status/`;
export const UPDATE_CAL_STATUS_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/edit_cal_status/`;

export const ADD_GAUGE_DATA_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/add_gauge_table/`;
export const GET_GAUGE_DATA_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_gauge_table/`;
export const DELETE_GAUGE_DATA_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/delete_gauge_table/`;
export const UPDATE_GAUGE_DATA_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/edit_gauge_table/`;

export const GET_CAL_DATE_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_calibration_date/`;
export const GET_LEAST_COUNT_FREQ_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_least_count_frequency/`;
export const GET_LOCATION_GNAME_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_location_gauge_name/`;
export const SUBMIT_CALIBRATION_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/submit_calibration_report/`;
export const GET_CAL_REPORT_RESULT_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_cal_report_result/`;

export const GET_CAL_MAILER_LIST_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_cal_mailer_list/`;
export const DELETE_CAL_MAILER_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/delete_cal_mailer_entry/`;
export const UPDATE_CAL_MAILER_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/edit_cal_mailer_list/`;
export const CAL_MAILER_NEWENTRY_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/add_cal_mail_entry/`;

export const GET_GAUGEID_MAIL_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/get_gaugeid_mail/`;
export const DELETE_GAUGEID_MAIL_URL = `${MAIN_DOMAIN}/${APP_NAMES.Quality}/delete_gaugeid_mail/`;
export const UPDATE_GAUGEID_MAIL_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/edit_gaugeid_mail/`;
export const ADD_GAUGEID_MAIL_URL =  `${MAIN_DOMAIN}/${APP_NAMES.Quality}/add_gaugeid_mail/`;



// Add more URLs as needed