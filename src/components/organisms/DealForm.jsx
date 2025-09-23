import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";

const DealForm = ({ deal, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    dealName: '',
    company: '',
    dealValue: '',
    probability: '',
    expectedCloseDate: '',
    stage: '',
    assignedRep: '',
    priority: 'Medium',
    tags: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const stageOptions = [
    { value: '', label: 'Select Stage' },
    { value: 'Discovery', label: 'Discovery' },
    { value: 'Qualification', label: 'Qualification' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Verbal Commitment', label: 'Verbal Commitment' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' }
  ];

  const priorityOptions = [
    { value: '', label: 'Select Priority' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ];

  const repOptions = [
    { value: '', label: 'Select Rep' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Michael Chen', label: 'Michael Chen' },
    { value: 'Emma Rodriguez', label: 'Emma Rodriguez' },
    { value: 'David Kim', label: 'David Kim' },
    { value: 'Lisa Thompson', label: 'Lisa Thompson' },
    { value: 'Robert Wilson', label: 'Robert Wilson' },
    { value: 'Jennifer Martinez', label: 'Jennifer Martinez' },
    { value: 'Alex Zhang', label: 'Alex Zhang' },
    { value: 'Chris Anderson', label: 'Chris Anderson' },
    { value: 'Monica Singh', label: 'Monica Singh' },
    { value: 'Kevin Park', label: 'Kevin Park' },
    { value: 'Taylor Brooks', label: 'Taylor Brooks' },
    { value: 'Ashley Davis', label: 'Ashley Davis' },
    { value: 'Jordan Lee', label: 'Jordan Lee' },
    { value: 'Riley Cohen', label: 'Riley Cohen' }
  ];

  useEffect(() => {
    if (isOpen) {
      if (deal) {
        setFormData({
          dealName: deal.dealName || '',
          company: deal.company || '',
          dealValue: deal.dealValue || '',
          probability: deal.probability || '',
          expectedCloseDate: deal.expectedCloseDate || '',
          stage: deal.stage || '',
          assignedRep: deal.assignedRep || '',
          priority: deal.priority || 'Medium',
          tags: deal.tags || ''
        });
      } else {
        setFormData({
          dealName: '',
          company: '',
          dealValue: '',
          probability: '',
          expectedCloseDate: '',
          stage: 'Discovery',
          assignedRep: '',
          priority: 'Medium',
          tags: ''
        });
      }
      setErrors({});
    }
  }, [deal, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.dealName.trim()) {
      newErrors.dealName = 'Deal name is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    if (!formData.dealValue || formData.dealValue <= 0) {
      newErrors.dealValue = 'Deal value must be greater than 0';
    }
    
    if (!formData.probability || formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
    }

    if (!formData.stage) {
      newErrors.stage = 'Stage is required';
    }

    if (!formData.assignedRep) {
      newErrors.assignedRep = 'Assigned rep is required';
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = 'Expected close date is required';
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
        dealValue: parseFloat(formData.dealValue),
        probability: parseInt(formData.probability)
      };
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({
        dealName: '',
        company: '',
        dealValue: '',
        probability: '',
        expectedCloseDate: '',
        stage: '',
        assignedRep: '',
        priority: 'Medium',
        tags: ''
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
              value={formData.dealName}
              onChange={(e) => handleInputChange('dealName', e.target.value)}
              placeholder="Enter deal name"
              className={errors.dealName ? 'border-red-300' : ''}
            />
            {errors.dealName && <p className="text-sm text-red-600 mt-1">{errors.dealName}</p>}
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Enter company name"
              className={errors.company ? 'border-red-300' : ''}
            />
            {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
          </div>

          {/* Deal Value and Probability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dealValue">Deal Value ($) *</Label>
              <Input
                id="dealValue"
                type="number"
                min="0"
                step="1000"
                value={formData.dealValue}
                onChange={(e) => handleInputChange('dealValue', e.target.value)}
                placeholder="0"
                className={errors.dealValue ? 'border-red-300' : ''}
              />
              {errors.dealValue && <p className="text-sm text-red-600 mt-1">{errors.dealValue}</p>}
            </div>

            <div>
              <Label htmlFor="probability">Probability (%) *</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleInputChange('probability', e.target.value)}
                placeholder="0"
                className={errors.probability ? 'border-red-300' : ''}
              />
              {errors.probability && <p className="text-sm text-red-600 mt-1">{errors.probability}</p>}
            </div>
          </div>

          {/* Expected Close Date */}
          <div>
            <Label htmlFor="expectedCloseDate">Expected Close Date *</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => handleInputChange('expectedCloseDate', e.target.value)}
              className={errors.expectedCloseDate ? 'border-red-300' : ''}
            />
            {errors.expectedCloseDate && <p className="text-sm text-red-600 mt-1">{errors.expectedCloseDate}</p>}
          </div>

          {/* Stage and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stage">Stage *</Label>
              <Select
                id="stage"
                value={formData.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
                options={stageOptions}
                className={errors.stage ? 'border-red-300' : ''}
              />
              {errors.stage && <p className="text-sm text-red-600 mt-1">{errors.stage}</p>}
            </div>

            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                options={priorityOptions}
                className={errors.priority ? 'border-red-300' : ''}
              />
              {errors.priority && <p className="text-sm text-red-600 mt-1">{errors.priority}</p>}
            </div>
          </div>

          {/* Assigned Rep */}
          <div>
            <Label htmlFor="assignedRep">Assigned Rep *</Label>
            <Select
              id="assignedRep"
              value={formData.assignedRep}
              onChange={(e) => handleInputChange('assignedRep', e.target.value)}
              options={repOptions}
              className={errors.assignedRep ? 'border-red-300' : ''}
            />
            {errors.assignedRep && <p className="text-sm text-red-600 mt-1">{errors.assignedRep}</p>}
          </div>

          {/* Tags */}
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