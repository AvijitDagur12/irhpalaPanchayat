import React from "react";
import DepartmentLogin from "./DepartmentLogin";

const MemberLogin = () => (
  <DepartmentLogin
    deptTitle="Elected Member Certificate Desk"
    deptBengali="নির্বাচিত সদস্য সনদপত্র বিভাগ"
    deptIcon="🏛️"
    accent="#0284c7"
    allowedRoles={["member", "elected_member"]}
    redirectPath="/admin/certificates"
    placeholderEmail="user@irhpala.in"
  />
);

export default MemberLogin;