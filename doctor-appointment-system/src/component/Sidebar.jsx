import React from "react";

export default function Sidebar({ isOpen, activeTab, setActiveTab }) {
  const menuItems = [
    { id: "home", label: "Dashboard Overview" },
    { id: "departments", label: "Departments" },
    { id: "doctors", label: "Available Doctors" },
  ];

  return (
    <aside
      className={`
        bg-(--color-medical-dark) text-slate-100 p-6 flex flex-col justify-between 
        border-r border-slate-800 transition-all duration-300 z-40
        /* Mobile Layout: Top-down absolute list */
        absolute top-0 left-0 w-full md:relative md:w-64 h-[calc(100vh-4rem)]
        ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none md:hidden"}
      `}
    >
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Side Menu
        </h2>

        {/* Navigation Links */}
        <nav className="space-y-2 mb-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left block px-4 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer ${
                activeTab === item.id
                  ? "bg-(--color-medical-teal) text-white shadow-sm font-bold"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Hospital Details Box */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-sm text-slate-300 shadow-inner">
          <p className="font-bold text-white mb-2 text-base">
            Hospital Details
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            <p>
              📍 <span className="text-slate-200">Islamabad, Pakistan</span>
            </p>
            <p>
              ⏰ <span className="text-slate-200">24/7 Emergency Open</span>
            </p>
            <p>
              📞{" "}
              <span className="text-slate-200">+92-51-111-123-EMERGENCY</span>
            </p>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
        Single-Tenant Hospital System
      </div>
    </aside>
  );
}
