import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStageColor = (stage) => {
  switch (stage?.toLowerCase()) {
    case 'discovery':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'qualification':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'proposal':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'negotiation':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'verbal commitment':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'closed won':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'closed lost':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatCurrency = (amount) => {
  if (!amount) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

const DealCard = ({ deal, onEdit, onDelete, onLogActivity }) => {
const displayName = deal.Name_c || 'Unnamed Deal';
  const weightedValue = deal.Value_c || 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="p-6">
        {/* Header with Deal Name and Priority */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-secondary-700 transition-colors line-clamp-2">
              {displayName}
            </h3>
{deal.company_id_c?.Name && (
              <p className="text-sm text-slate-500 mt-1 flex items-center">
                <ApperIcon name="Building2" className="w-3 h-3 mr-1" />
                {deal.company_id_c.Name}
              </p>
            )}
          </div>

          {/* Priority Badge */}
{deal.Tags && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-600 border-blue-200">
              {deal.Tags}
            </span>
          )}
        </div>

        {/* Deal Value and Probability */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Deal Value</p>
            <p className="text-lg font-bold text-slate-800">
{formatCurrency(deal.Value_c)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Probability</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
style={{ width: "75%" }}
                ></div>
              </div>
              <span className="text-sm font-medium text-slate-700">
Progress
              </span>
            </div>
          </div>
        </div>

        {/* Weighted Value */}
        <div className="mb-4 p-3 bg-secondary-50 rounded-lg border border-secondary-100">
          <p className="text-xs text-secondary-600 mb-1">Weighted Value</p>
          <p className="text-lg font-bold text-secondary-800">
{formatCurrency(weightedValue)}
          </p>
        </div>

        {/* Stage and Close Date */}
        <div className="space-y-2 mb-4">
{deal.Status_c && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Status</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(deal.Status_c)}`}>
                {deal.stage}
              </span>
            </div>
          )}

{deal.CloseDate_c && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Close Date</span>
              <span className="text-xs font-medium text-slate-700">
                {formatDate(deal.expectedCloseDate)}
              </span>
            </div>
          )}

{deal.Owner?.Name && (
            <div className="flex items-center text-sm text-slate-600">
              <ApperIcon name="User" className="w-4 h-4 mr-2 text-slate-400" />
              <span>{deal.Owner.Name}</span>
            </div>
          )}
        </div>

        {/* Tags */}
{deal.Tags && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {deal.tags.split(',').filter(Boolean).map((tag, index) => (
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

        {/* Quick Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(deal)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
              Edit
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLogActivity(deal)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ApperIcon name="FileText" className="w-4 h-4 mr-1" />
              Log
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(deal)}
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

export default DealCard;