import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Label from "@/components/atoms/Label";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const DealForm = ({ deal, isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    Name_c: '',
    company_id_c: '',
    Value_c: '',
    CloseDate_c: '',
    Status_c: 'Prospecting',
    contact_id_c: '',
    Tags: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'Prospecting', label: 'Prospecting' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' }
  ];

  // Mock company options - in production, this would come from companies service
  const companyOptions = [
    { value: '', label: 'Select Company' },
    { value: '1', label: 'TechCorp Solutions' },
    { value: '2', label: 'DataFlow Inc' },
    { value: '3', label: 'StartupXYZ' },
    { value: '4', label: 'GlobalTech Ltd' },
    { value: '5', label: 'BrandBuilders Co' }
  ];

// Mock contact options - in production, this would come from contacts service  
  const contactOptions = [
    { value: '', label: 'Select Contact' },
    { value: '1', label: 'John Smith' },
    { value: '2', label: 'Jane Doe' },
    { value: '3', label: 'Mike Johnson' },
    { value: '4', label: 'Sarah Wilson' },
    { value: '5', label: 'David Brown' }
  ];
useEffect(() => {
    if (deal) {
      setFormData({
        Name_c: deal.Name_c || '',
        company_id_c: deal.company_id_c?.Id || '',
        Value_c: deal.Value_c || '',
        CloseDate_c: deal.CloseDate_c || '',
        Status_c: deal.Status_c || 'Prospecting',
        contact_id_c: deal.contact_id_c?.Id || '',
        Tags: deal.Tags || ''
      });
    } else {
      setFormData({
        Name_c: '',
        company_id_c: '',
        Value_c: '',
        CloseDate_c: '',
        Status_c: 'Prospecting',
        contact_id_c: '',
        Tags: ''
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name_c.trim()) {
      newErrors.Name_c = 'Deal name is required';
    }

    if (!formData.company_id_c) {
      newErrors.company_id_c = 'Company is required';
    }

    if (!formData.Value_c || formData.Value_c <= 0) {
      newErrors.Value_c = 'Deal value must be greater than 0';
    }

    if (!formData.Status_c) {
      newErrors.Status_c = 'Status is required';
    }

    if (!formData.CloseDate_c) {
      newErrors.CloseDate_c = 'Expected close date is required';
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
      const submitData = {
        ...formData,
        Value_c: parseFloat(formData.Value_c)
      };
      await onSave(submitData);
      
      setFormData({
        Name_c: '',
        company_id_c: '',
        Value_c: '',
        CloseDate_c: '',
        Status_c: 'Prospecting',
        contact_id_c: '',
        Tags: ''
      });
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
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
            {deal ? 'Edit Deal' : 'Add New Deal'}
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
          {/* Deal Name */}
          <div>
            <Label htmlFor="dealName">Deal Name *</Label>
            <Input
              id="dealName"
              placeholder="Enter deal name"
              value={formData.Name_c}
              onChange={(e) => handleInputChange('Name_c', e.target.value)}
              className={errors.Name_c ? 'border-red-300' : ''}
            />
            {errors.Name_c && <p className="text-sm text-red-600 mt-1">{errors.Name_c}</p>}
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Company *</Label>
            <Select
              id="company"
              value={formData.company_id_c}
              onChange={(e) => handleInputChange('company_id_c', e.target.value)}
              options={companyOptions}
              className={errors.company_id_c ? 'border-red-300' : ''}
            />
            {errors.company_id_c && <p className="text-sm text-red-600 mt-1">{errors.company_id_c}</p>}
          </div>

          {/* Contact */}
          <div>
            <Label htmlFor="contact">Contact</Label>
            <Select
              id="contact"
              value={formData.contact_id_c}
              onChange={(e) => handleInputChange('contact_id_c', e.target.value)}
              options={contactOptions}
              className={errors.contact_id_c ? 'border-red-300' : ''}
            />
            {errors.contact_id_c && <span className="text-red-500 text-xs">{errors.contact_id_c}</span>}
          </div>

          {/* Deal Value */}
          <div>
            <Label htmlFor="dealValue">Deal Value ($) *</Label>
            <Input
              id="dealValue"
              type="number"
              min="0"
              step="1000"
              value={formData.Value_c}
              onChange={(e) => handleInputChange('Value_c', e.target.value)}
              placeholder="0"
              className={errors.Value_c ? 'border-red-300' : ''}
            />
            {errors.Value_c && <p className="text-sm text-red-600 mt-1">{errors.Value_c}</p>}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              id="status"
              value={formData.Status_c}
              onChange={(e) => handleInputChange('Status_c', e.target.value)}
              options={statusOptions}
              className={errors.Status_c ? 'border-red-300' : ''}
            />
            {errors.Status_c && <p className="text-sm text-red-600 mt-1">{errors.Status_c}</p>}
          </div>

          {/* Expected Close Date */}
          <div>
            <Label htmlFor="expectedCloseDate">Expected Close Date *</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              value={formData.CloseDate_c}
              onChange={(e) => handleInputChange('CloseDate_c', e.target.value)}
              className={errors.CloseDate_c ? 'border-red-300' : ''}
            />
            {errors.CloseDate_c && <p className="text-sm text-red-600 mt-1">{errors.CloseDate_c}</p>}
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Textarea
              id="tags"
              placeholder="Enter tags separated by commas"
              value={formData.Tags}
              onChange={(e) => handleInputChange('Tags', e.target.value)}
              className={errors.Tags ? 'border-red-300' : ''}
              rows={3}
            />
            <p className="text-sm text-slate-500 mt-1">Separate multiple tags with commas</p>
            {errors.Tags && <span className="text-red-500 text-xs">{errors.Tags}</span>}
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
                  {deal ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  {deal ? 'Update Deal' : 'Create Deal'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DealForm;