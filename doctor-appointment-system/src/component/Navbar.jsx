import React from "react";

export default function Navbar({ onToggleSidebar, activeTab, setActiveTab }) {
  const navItems = [
    { id: "home", label: "HOME", mobileShow: true },
    { id: "departments", label: "Departments", mobileShow: false },
    { id: "doctors", label: "Doctors", mobileShow: false },
  ];

  return (
    <header className="bg-(--color-medical-dark) border-b border-slate-800 h-16 px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl text-sm transition cursor-pointer flex items-center justify-center border border-slate-700"
          title="Toggle Menu"
        >
          ☰
        </button>

        <div className="flex items-center space-x-2">
          <div className="bg-(--color-medical-primary) text-white font-bold p-1.5 rounded-lg text-sm">
            HMS
          </div>
          <span className="font-bold text-white text-lg hidden sm:block">
            Shifa Care
          </span>
        </div>

        {/* Search Box */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search doctors..."
            className="bg-(--color-medical-light) border border-slate-300 text-sm rounded-xl px-4 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-(--color-medical-primary) w-64 text-slate-700"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
            🔍
          </span>
        </div>
      </div>

      {/* Right Section: Navigation Links & Register */}
      <div className="flex items-center space-x-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer ${
              item.mobileShow ? "block" : "hidden md:block"
            } ${
              activeTab === item.id
                ? "bg-(--color-btn-selected-bg) text-(--color-btn-selected-text) opacity-100"
                : "bg-(--color-btn-unselected-bg) text-(--color-btn-unselected-text) opacity-80 hover:opacity-100"
            }`}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => setActiveTab("register")}
          className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer ${
            activeTab === "register"
              ? "bg-(--color-btn-selected-bg) text-(--color-btn-selected-text) opacity-100"
              : "bg-(--color-btn-unselected-bg) text-white hover:opacity-90"
          }`}
        >
          Register
        </button>
      </div>
    </header>
  );
}
