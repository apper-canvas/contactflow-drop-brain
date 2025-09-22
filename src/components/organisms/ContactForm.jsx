import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { companiesService } from "@/services/api/companiesService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const ContactForm = ({ 
  contact = null, 
  isOpen = false, 
  onClose, 
  onSave 
}) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyId: "",
    title: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      if (contact) {
        setFormData({
          firstName: contact.firstName || "",
          lastName: contact.lastName || "",
          email: contact.email || "",
          phone: contact.phone || "",
          companyId: contact.companyId || "",
          title: contact.title || "",
          notes: contact.notes || ""
        });
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          companyId: "",
          title: "",
          notes: ""
        });
      }
      setErrors({});
    }
  }, [contact, isOpen]);

  const loadCompanies = async () => {
    try {
      const data = await companiesService.getAll();
      setCompanies(data);
    } catch (error) {
      console.error("Error loading companies:", error);
      toast.error("Failed to load companies");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const contactData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      if (!contact) {
        contactData.createdAt = new Date().toISOString();
      }
      
      await onSave(contactData);
      
      toast.success(contact ? "Contact updated successfully!" : "Contact created successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact");
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
    <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.95
            }}
            animate={{
                opacity: 1,
                scale: 1
            }}
            exit={{
                opacity: 0,
                scale: 0.95
            }}
            transition={{
                duration: 0.2
            }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div
                className="relative bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div
                    className="bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <ApperIcon name="User" className="w-6 h-6" />
                            <h2 className="text-lg font-semibold">
                                {contact ? "Edit Contact" : "New Contact"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
                            <ApperIcon name="X" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="First Name"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange("firstName")}
                            error={errors.firstName}
                            placeholder="Enter first name" />
                        <FormField
                            label="Last Name"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange("lastName")}
                            error={errors.lastName}
                            placeholder="Enter last name" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Email"
                            type="input"
                            id="email"
                            value={formData.email}
                            onChange={handleChange("email")}
                            error={errors.email}
                            placeholder="Enter email address" />
                        <FormField
                            label="Phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange("phone")}
                            placeholder="Enter phone number" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Company"
                            type="select"
                            id="companyId"
                            value={formData.companyId}
                            onChange={handleChange("companyId")}>
                            <option value="">Select company (optional)</option>
                            {companies.map(company => <option key={company.Id} value={company.Id}>
                                {company.name}
                            </option>)}
                        </FormField>
                        <FormField
                            label="Job Title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange("title")}
                            placeholder="Enter job title" />
                    </div>
                    <FormField
                        label="Notes"
                        type="textarea"
                        id="notes"
                        value={formData.notes}
                        onChange={handleChange("notes")}
                        placeholder="Additional notes about this contact"
                        rows={4} />
                    {/* Actions */}
                    <div
                        className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel
                                          </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="min-w-[120px]">
                            {loading ? <div className="flex items-center space-x-2">
                                <div
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                            </div> : <div className="flex items-center space-x-2">
                                <ApperIcon name="Save" className="w-4 h-4" />
                                <span>{contact ? "Update" : "Create"}</span>
                            </div>}
                        </Button>
                    </div>
                </form>
            </div></motion.div>
    </div>
</AnimatePresence>
  );
};

export default ContactForm;