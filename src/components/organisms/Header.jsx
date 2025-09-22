import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ContactFlow
              </h1>
              <p className="text-xs text-slate-500">Professional CRM</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <NavLink
              to="/contacts"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm border border-primary-200"
                    : "text-slate-600 hover:text-primary-600 hover:bg-primary-50 hover:scale-105"
                }`
              }
            >
              <ApperIcon name="Users" className="w-5 h-5 mr-2" />
              Contacts
            </NavLink>
            
            <NavLink
              to="/companies"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 shadow-sm border border-secondary-200"
                    : "text-slate-600 hover:text-secondary-600 hover:bg-secondary-50 hover:scale-105"
                }`
              }
            >
              <ApperIcon name="Building2" className="w-5 h-5 mr-2" />
              Companies
            </NavLink>
          </nav>

          {/* Export Actions */}
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors duration-200 rounded-lg hover:bg-primary-50">
                <ApperIcon name="Download" className="w-5 h-5" />
              </button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="p-2 text-slate-400 hover:text-secondary-600 transition-colors duration-200 rounded-lg hover:bg-secondary-50">
                <ApperIcon name="Settings" className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;