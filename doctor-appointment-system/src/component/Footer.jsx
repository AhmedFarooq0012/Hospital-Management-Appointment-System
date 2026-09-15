import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-(--color-medical-dark) text-slate-400 text-center py-4 border-t border-slate-800 text-xs z-50 sticky bottom-0">
      {new Date().getFullYear()}{" "}
      <span className="text-white font-semibold">Shifa Care HMS</span>. All
      Rights Reserved. Emergency Dispatch Hotline: +92-51-111-123-EMERGENCY
    </footer>
  );
}
