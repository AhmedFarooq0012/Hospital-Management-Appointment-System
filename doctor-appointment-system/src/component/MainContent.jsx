import React from "react";
import Sign_Up_Account from "./Sign_Up_Account";

export default function MainContent({ activeTab }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
      {activeTab === "home" && (
        <div>
          <h1 className="text-2xl font-bold text-(--color-medical-dark)">
            🚀 Dashboard Overview
          </h1>
          <p className="text-slate-600 mt-2">
            Welcome to Shifa Care. This home dashboard element is selected by
            default.
          </p>
        </div>
      )}

      {activeTab === "departments" && (
        <div>
          <h1 className="text-2xl font-bold text-(--color-medical-dark)">
            🏢 Medical Departments
          </h1>
          <p className="text-slate-600 mt-2">
            Browse various clinics, OPDI blocks, and specializations.
          </p>
        </div>
      )}

      {activeTab === "doctors" && (
        <div>
          <h1 className="text-2xl font-bold text-(--color-medical-dark)">
            🩺 Available Doctors
          </h1>
          <p className="text-slate-600 mt-2">
            List of operating clinicians and on-duty doctors.
          </p>
        </div>
      )}

      {activeTab === "register" && (
        <div>
          <Sign_Up_Account />
        </div>
      )}
    </div>
  );
}
