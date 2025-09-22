import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CompanyForm = ({ 
  company = null, 
  isOpen = false, 
  onClose, 
  onSave 
}) => {
  const [loading, setLoading] = useState(false);
const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    website: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  const industryOptions = [
    "Technology",
    "Healthcare", 
    "Finance",
    "Manufacturing",
    "Retail",
    "Education",
    "Real Estate",
    "Consulting",
    "Other"
  ];

  const sizeOptions = [
    "1-10",
    "11-50",
    "51-200", 
    "201-1000",
    "1000+"
  ];

  useEffect(() => {
    if (isOpen) {
      if (company) {
setFormData({
          name: company.name_c || company.name || "",
          industry: company.industry_c || company.industry || "",
          size: company.size_c || company.size || "",
          website: company.website_c || company.website || "",
          description: company.description_c || company.description || ""
        });
      } else {
        setFormData({
          name: "",
          industry: "",
          size: "",
          website: "",
          description: ""
        });
      }
      setErrors({});
    }
  }, [company, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string.startsWith("http") ? string : `https://${string}`);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let websiteUrl = formData.website;
      if (websiteUrl && !websiteUrl.startsWith("http")) {
        websiteUrl = `https://${websiteUrl}`;
      }
      
      const companyData = {
        ...formData,
        website: websiteUrl,
        updatedAt: new Date().toISOString()
      };
      
      if (!company) {
        companyData.createdAt = new Date().toISOString();
        companyData.contactIds = [];
      }
      
      await onSave(companyData);
      
      toast.success(company ? "Company updated successfully!" : "Company created successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error("Failed to save company");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Building2" className="w-6 h-6" />
                <h2 className="text-lg font-semibold">
                  {company ? "Edit Company" : "New Company"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <FormField
              label="Company Name"
              id="name"
              value={formData.name}
              onChange={handleChange("name")}
              error={errors.name}
              placeholder="Enter company name"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Industry"
                type="select"
                id="industry"
                value={formData.industry}
                onChange={handleChange("industry")}
              >
                <option value="">Select industry</option>
                {industryOptions.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </FormField>
              
              <FormField
                label="Company Size"
                type="select"
                id="size"
                value={formData.size}
                onChange={handleChange("size")}
              >
                <option value="">Select size</option>
                {sizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </FormField>
            </div>

            <FormField
              label="Website"
              id="website"
              value={formData.website}
              onChange={handleChange("website")}
              error={errors.website}
              placeholder="Enter website URL"
            />

            <FormField
              label="Description"
              type="textarea"
              id="description"
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Brief description of the company"
              rows={4}
            />

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="secondary"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Save" className="w-4 h-4" />
                    <span>{company ? "Update" : "Create"}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompanyForm;