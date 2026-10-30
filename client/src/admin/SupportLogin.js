import React from "react";
import DepartmentLogin from "./DepartmentLogin";

const SupportLogin = () => (
  <DepartmentLogin
    deptTitle="Public Grievance Redressal Cell"
    deptBengali="জনঅভিযোগ প্রতিকার ও নিষ্পত্তি সেল"
    deptIcon="📢"
    accent="#d97706"
    allowedRoles={["support"]}
    redirectPath="/admin/Support"
    placeholderEmail="support@panchayat.gov.in"
  />
);

export default SupportLogin;