import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Error = ({ 
  error = "Something went wrong", 
  onRetry,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <div className="text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-500" />
        </div>
        
        {/* Error Message */}
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          {error}
        </p>
        
        {/* Retry Button */}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            className="shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Error;