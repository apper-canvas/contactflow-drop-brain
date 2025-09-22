import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";

const LeadForm = ({ lead, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    tags: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: '',
    leadSource: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Lost', label: 'Lost' },
    { value: 'Won', label: 'Won' }
  ];

  const leadSourceOptions = [
    { value: '', label: 'Select Lead Source' },
    { value: 'Web', label: 'Web' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Trade Show', label: 'Trade Show' },
    { value: 'Advertisement', label: 'Advertisement' }
  ];

  useEffect(() => {
    if (isOpen) {
      if (lead) {
        setFormData({
          name: lead.name || '',
          tags: lead.tags || '',
          firstName: lead.firstName || '',
          lastName: lead.lastName || '',
          email: lead.email || '',
          phone: lead.phone || '',
          company: lead.company || '',
          status: lead.status || '',
          leadSource: lead.leadSource || ''
        });
      } else {
        setFormData({
          name: '',
          tags: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          status: 'New',
          leadSource: ''
        });
      }
      setErrors({});
    }
  }, [lead, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
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
      await onSave(formData);
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({
        name: '',
        tags: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        status: '',
        leadSource: ''
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Lead Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter lead name"
              className={errors.name ? 'border-red-300' : ''}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                className={errors.firstName ? 'border-red-300' : ''}
              />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                className={errors.lastName ? 'border-red-300' : ''}
              />
              {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? 'border-red-300' : ''}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className={errors.phone ? 'border-red-300' : ''}
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Company Field */}
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Enter company name"
              className={errors.company ? 'border-red-300' : ''}
            />
            {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
          </div>

          {/* Status and Lead Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                options={statusOptions}
                className={errors.status ? 'border-red-300' : ''}
              />
              {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
            </div>

            <div>
              <Label htmlFor="leadSource">Lead Source</Label>
              <Select
                id="leadSource"
                value={formData.leadSource}
                onChange={(e) => handleInputChange('leadSource', e.target.value)}
                options={leadSourceOptions}
                className={errors.leadSource ? 'border-red-300' : ''}
              />
              {errors.leadSource && <p className="text-sm text-red-600 mt-1">{errors.leadSource}</p>}
            </div>
          </div>

          {/* Tags Field */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas"
              className={errors.tags ? 'border-red-300' : ''}
            />
            <p className="text-sm text-slate-500 mt-1">Separate multiple tags with commas</p>
            {errors.tags && <p className="text-sm text-red-600 mt-1">{errors.tags}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  {lead ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  {lead ? 'Update Lead' : 'Create Lead'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LeadForm;