import React from "react";
import DepartmentLogin from "./DepartmentLogin";

const SecretaryLogin = () => (
  <DepartmentLogin
    deptTitle="Gram Panchayat / PSC Admin"
    deptBengali="গ্রাম পঞ্চায়েত সচিব ও প্রশাসনিক বিভাগ"
    deptIcon="📜"
    accent="#166534"
    allowedRoles={["secretary"]}
    redirectPath="/psc"
    placeholderEmail="secretary@panchayat.gov.in"
  />
);

export default SecretaryLogin;