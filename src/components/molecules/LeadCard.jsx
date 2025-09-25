import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'contacted':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'qualified':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'lost':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'won':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getLeadSourceIcon = (source) => {
  switch (source?.toLowerCase()) {
    case 'web':
      return 'Globe';
    case 'referral':
      return 'Users';
    case 'trade show':
      return 'Calendar';
    case 'advertisement':
      return 'Megaphone';
    default:
      return 'HelpCircle';
  }
};

const LeadCard = ({ lead, onEdit, onDelete, onEmailClick, onPhoneClick }) => {
  const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
  const displayName = fullName || lead.name || 'Unnamed Lead';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="p-6">
        {/* Header with Name and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-secondary-700 transition-colors">
              {displayName}
            </h3>
{(lead.company?.Name || lead.company) && (
              <p className="text-sm text-slate-500 mt-1 flex items-center">
                <ApperIcon name="Building" className="w-3 h-3 mr-1" />
                {lead.company?.Name || lead.company}
              </p>
            )}
          </div>

          {/* Status Badge */}
          {lead.status && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {lead.email && (
            <div className="flex items-center text-sm text-slate-600">
              <ApperIcon name="Mail" className="w-4 h-4 mr-3 text-slate-400" />
              <button
                onClick={() => onEmailClick(lead.email)}
                className="hover:text-secondary-600 transition-colors truncate"
              >
                {lead.email}
              </button>
            </div>
          )}

          {lead.phone && (
            <div className="flex items-center text-sm text-slate-600">
              <ApperIcon name="Phone" className="w-4 h-4 mr-3 text-slate-400" />
              <button
                onClick={() => onPhoneClick(lead.phone)}
                className="hover:text-secondary-600 transition-colors"
              >
                {lead.phone}
              </button>
            </div>
          )}

          {lead.leadSource && (
            <div className="flex items-center text-sm text-slate-600">
              <ApperIcon name={getLeadSourceIcon(lead.leadSource)} className="w-4 h-4 mr-3 text-slate-400" />
              <span>Source: {lead.leadSource}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {lead.tags && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {lead.tags.split(',').filter(Boolean).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary-50 text-secondary-700 border border-secondary-200"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(lead)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
            Edit
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(lead)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LeadCard;