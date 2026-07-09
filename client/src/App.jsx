import React, { useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Activity,
  Database,
  GitBranch,
  Search,
  Users,
  FileText,
  CheckCircle,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import DatasetEDA from "./pages/DatasetEDA";
import FeatureEngineering from "./pages/FeatureEngineering";
import ModelDevelopment from "./pages/ModelDevelopment";
import Evaluation from "./pages/Evaluation";
import Classifier from "./pages/Classifier";
import TeamMethodology from "./pages/TeamMethodology";
import Notebooks from "./pages/Notebooks";

function NavLink({ to, icon: Icon, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
      ${isActive ? "bg-[#2a9d8f] text-white shadow-md shadow-[#2a9d8f]/20" : "text-on-primary-container hover:bg-primary-container hover:text-white"}`}
    >
      <Icon size={18} className={isActive ? "text-white" : "text-[#2a9d8f]"} />
      {children}
    </Link>
  );
}

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0f1f3d]/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#00071b] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out border-r border-[#1a365d] shadow-2xl lg:shadow-none lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#b7c6ed]">
              Veritas<span className="text-[#2a9d8f]">AI</span>
            </h1>
            <p className="text-[10px] text-[#7887ab] mt-1 tracking-widest uppercase font-bold">
              Data Science Capstone
            </p>
          </div>
          <button
            className="lg:hidden text-white/50 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavLink to="/" icon={Activity} onClick={() => setIsOpen(false)}>
            Dashboard
          </NavLink>

          <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-[#545f72] uppercase tracking-widest">
            Methodology Pipeline
          </div>
          <NavLink
            to="/dataset-eda"
            icon={Database}
            onClick={() => setIsOpen(false)}
          >
            Dataset & EDA
          </NavLink>
          <NavLink
            to="/feature-engineering"
            icon={GitBranch}
            onClick={() => setIsOpen(false)}
          >
            Feature Engineering
          </NavLink>
          <NavLink
            to="/model-development"
            icon={CheckCircle}
            onClick={() => setIsOpen(false)}
          >
            Model Development
          </NavLink>
          <NavLink
            to="/evaluation"
            icon={FileText}
            onClick={() => setIsOpen(false)}
          >
            Evaluation & Tuning
          </NavLink>
          <NavLink
            to="/notebooks"
            icon={BookOpen}
            onClick={() => setIsOpen(false)}
          >
            Jupyter Notebooks
          </NavLink>

          <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-[#545f72] uppercase tracking-widest">
            Live Application
          </div>
          <NavLink
            to="/classifier"
            icon={Search}
            onClick={() => setIsOpen(false)}
          >
            Live Classifier
          </NavLink>
          <NavLink
            to="/team-methodology"
            icon={Users}
            onClick={() => setIsOpen(false)}
          >
            Team & Reports
          </NavLink>
        </nav>

        <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-[#0f1f3d] to-[#1a365d] border border-[#2a9d8f]/20 shadow-inner">
          <div className="text-[10px] text-[#b7c6ed] font-mono text-center tracking-wider">
            v1.0.0 &bull; ISOT DB SYNCED
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-[#f5f3f6] text-[#1b1b1e] font-sans selection:bg-[#2a9d8f] selection:text-white">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b border-surface-variant p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <h1 className="text-xl font-bold tracking-tight text-primary">
              Veritas<span className="text-[#2a9d8f]">AI</span>
            </h1>
            <button
              className="p-2 text-secondary hover:bg-surface-variant rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </header>

          <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden animate-fade-in max-w-[1600px] mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dataset-eda" element={<DatasetEDA />} />
              <Route
                path="/feature-engineering"
                element={<FeatureEngineering />}
              />
              <Route path="/model-development" element={<ModelDevelopment />} />
              <Route path="/evaluation" element={<Evaluation />} />
              <Route path="/notebooks" element={<Notebooks />} />
              <Route path="/classifier" element={<Classifier />} />
              <Route path="/team-methodology" element={<TeamMethodology />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
