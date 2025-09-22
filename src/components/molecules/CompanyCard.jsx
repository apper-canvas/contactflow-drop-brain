import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const CompanyCard = ({ 
  company, 
  contactCount = 0,
  onEdit, 
  onDelete,
  onWebsiteClick 
}) => {
  const getIndustryIcon = (industry) => {
    const icons = {
      "Technology": "Laptop",
      "Healthcare": "Heart",
      "Finance": "DollarSign",
      "Manufacturing": "Settings",
      "Retail": "ShoppingBag",
      "Education": "GraduationCap",
      "Real Estate": "Building",
      "Consulting": "Users",
      "Other": "Building2"
    };
    return icons[industry] || "Building2";
  };

  const getSizeColor = (size) => {
    const colors = {
      "1-10": "text-green-600 bg-green-100",
      "11-50": "text-blue-600 bg-blue-100", 
      "51-200": "text-purple-600 bg-purple-100",
      "201-1000": "text-orange-600 bg-orange-100",
      "1000+": "text-red-600 bg-red-100"
    };
    return colors[size] || "text-slate-600 bg-slate-100";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary-500 bg-gradient-to-r from-white to-slate-50">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Company Icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white shadow-lg">
              <ApperIcon name={getIndustryIcon(company.industry)} className="w-6 h-6" />
            </div>
            
            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-800 truncate mb-1">
                {company.name}
              </h3>
              
              <div className="flex items-center space-x-3 mb-3">
                {company.industry && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                    {company.industry}
                  </span>
                )}
                
                {company.size && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSizeColor(company.size)}`}>
                    {company.size} employees
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                {company.website && (
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Globe" className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="truncate">{company.website}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-slate-600">
                  <ApperIcon name="Users" className="w-4 h-4 mr-2 text-slate-400" />
                  <span>{contactCount} contact{contactCount !== 1 ? "s" : ""}</span>
                </div>
              </div>
              
              {company.description && (
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                  {company.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 ml-4">
            {company.website && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWebsiteClick(company.website)}
                className="text-accent-600 hover:bg-accent-50"
              >
                <ApperIcon name="ExternalLink" className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(company)}
              className="text-primary-600 hover:bg-primary-50"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(company)}
              className="text-red-500 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CompanyCard;