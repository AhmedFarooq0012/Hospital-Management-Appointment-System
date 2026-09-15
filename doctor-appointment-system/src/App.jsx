import { useState } from "react";
import "./App.css";
import "./index.css";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import MainContent from "./component/MainContent";
import Footer from "./component/Footer";

function App() {
  // Navigation active state ko manage karne ke liye (Default: 'home')
  const [activeTab, setActiveTab] = useState("home");
  // Sidebar open/close control karne ke liye
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--color-medical-light) text-slate-800">
      {/* Navbar passing handler and active states */}
      <Navbar
        onToggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body Area */}
      <div className="flex flex-1 relative overflow-x-hidden">
        {/* Sidebar Layout */}
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic Main Content Container */}
        <main
          className={`flex-1 p-6 transition-all duration-300 min-h-[calc(100vh-8rem)] ${
            isSidebarOpen ? "md:ml-0" : "w-full"
          }`}
        >
          <MainContent activeTab={activeTab} />
        </main>
      </div>

      {/* Footer Fixed to Bottom */}
      <Footer />
    </div>
  );
}

export default App;
