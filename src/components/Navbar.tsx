import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import img from "../../assets/img/habibiLogo.svg";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    "Notifications",
    "User Management",
    "Influencer Management",
    "Invite User",
    "Token Details",
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_name");
    navigate("/");
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      <div className="w-full bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={img} alt="Logo" className="h-8 sm:h-10 object-contain" />
            </div>

            {/* Desktop Tabs */}
            <div className="hidden lg:flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-white/20 transition"
              >
                <LogOut className="w-5 h-5 text-gray-300 hover:text-white" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Portal-like overlay) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-gray-900 border-l border-gray-800 p-6 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <img src={img} alt="Logo" className="h-8" />
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex flex-col gap-2 flex-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Logout (Mobile) */}
              <button
                onClick={handleLogout}
                className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1b2433] rounded-lg text-white font-semibold"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
