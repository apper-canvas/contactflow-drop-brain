import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const ContactCard = ({ 
  contact, 
  company,
  onEdit, 
  onDelete, 
  onEmailClick,
  onPhoneClick 
}) => {
  const initials = `${contact.firstName?.[0] || ""}${contact.lastName?.[0] || ""}`.toUpperCase();
  
  return (
<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary-500 bg-gradient-to-r from-white to-slate-50">
        <div className="flex items-start space-x-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white font-semibold shadow-lg">
{(contact.first_name_c || contact.firstName)?.[0] || ""}{(contact.last_name_c || contact.lastName)?.[0] || ""}
              </div>
            </div>
            {/* Contact Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-800 truncate">
{contact.first_name_c || contact.firstName} {contact.last_name_c || contact.lastName}
              </h3>
              
{(contact.title_c || contact.title) && (
                <p className="text-sm text-slate-600 mb-1">{contact.title_c || contact.title}</p>
              )}
              
{company && (
                <p className="text-sm text-secondary-600 font-medium mb-2">
                  {company.name_c || company.name}
                </p>
              )}
              
              <div className="space-y-1">
{(contact.email_c || contact.email) && (
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="truncate">{contact.email_c || contact.email}</span>
                  </div>
                )}
                
{(contact.phone_c || contact.phone) && (
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{contact.phone_c || contact.phone}</span>
                  </div>
                )}
              </div>
              
{(contact.notes_c || contact.notes) && (
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                  {contact.notes_c || contact.notes}
                </p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 ml-4">
{(contact.email_c || contact.email) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEmailClick(contact.email_c || contact.email)}
                className="text-secondary-600 hover:bg-secondary-50"
              >
                <ApperIcon name="Mail" className="w-4 h-4" />
              </Button>
            )}
            
{(contact.phone_c || contact.phone) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPhoneClick(contact.phone_c || contact.phone)}
                className="text-accent-600 hover:bg-accent-50"
              >
                <ApperIcon name="Phone" className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
onClick={() => onEdit(contact)}
              className="text-secondary-600 hover:bg-secondary-50"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(contact)}
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

export default ContactCard;