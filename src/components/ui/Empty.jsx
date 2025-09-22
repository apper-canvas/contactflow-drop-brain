import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found",
  message = "Get started by adding your first item.",
  actionLabel = "Add New",
  onAction,
  icon = "Inbox",
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
        {/* Empty State Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <ApperIcon name={icon} className="w-10 h-10 text-slate-400" />
        </div>
        
        {/* Empty State Content */}
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
        
{/* Action Button */}
        {onAction && (
          <Button
            variant="primary"
            size="lg"
            className="shadow-lg hover:shadow-xl"
            onClick={onAction}
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;