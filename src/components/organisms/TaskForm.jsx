import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { companiesService } from "@/services/api/companiesService";
import { contactsService } from "@/services/api/contactsService";

const TaskForm = ({ 
  task = null, 
  isOpen = false, 
  onClose, 
  onSave 
}) => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    priority: "Medium",
    status: "Not Started",
    dueDate: "",
    companyId: "",
    contactId: "",
    tags: "",
    notes: "",
    callDetails: "",
    meetingDetails: "",
    followUp: false
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("general");

  const priorityOptions = ["Low", "Medium", "High"];
  const statusOptions = ["Not Started", "In Progress", "Completed", "Deferred"];

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      loadContacts();
      if (task) {
        setFormData({
          name: task.Name || "",
          subject: task.subject_c || "",
          priority: task.priority_c || "Medium",
          status: task.status_c || "Not Started",
          dueDate: task.due_date_c ? new Date(task.due_date_c).toISOString().slice(0, 16) : "",
          companyId: task.company_id_c?.Id || "",
          contactId: task.contact_id_c?.Id || "",
          tags: task.Tags || "",
          notes: task.notes_c || "",
          callDetails: task.call_details_c || "",
          meetingDetails: task.meeting_details_c || "",
          followUp: task.follow_up_c || false
        });
      } else {
        setFormData({
          name: "",
          subject: "",
          priority: "Medium",
          status: "Not Started",
          dueDate: "",
          companyId: "",
          contactId: "",
          tags: "",
          notes: "",
          callDetails: "",
          meetingDetails: "",
          followUp: false
        });
      }
      setErrors({});
      setActiveTab("general");
    }
  }, [task, isOpen]);

  const loadCompanies = async () => {
    try {
      const data = await companiesService.getAll();
      setCompanies(data);
    } catch (error) {
      console.error("Error loading companies:", error);
      toast.error("Failed to load companies");
    }
  };

  const loadContacts = async () => {
    try {
      const data = await contactsService.getAll();
      setContacts(data);
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast.error("Failed to load contacts");
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject?.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const now = new Date();
      if (dueDate < now) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    
    setLoading(true);
    
    try {
      const taskData = {
        Name: formData.name?.trim() || formData.subject?.trim() || "",
        subject_c: formData.subject?.trim() || "",
        priority_c: formData.priority || "Medium",
        status_c: formData.status || "Not Started",
        due_date_c: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        company_id_c: formData.companyId ? parseInt(formData.companyId) : null,
        contact_id_c: formData.contactId ? parseInt(formData.contactId) : null,
        Tags: formData.tags?.trim() || "",
        notes_c: formData.notes?.trim() || "",
        call_details_c: formData.callDetails?.trim() || "",
        meeting_details_c: formData.meetingDetails?.trim() || "",
        follow_up_c: Boolean(formData.followUp)
      };
      
      const success = await onSave(taskData);
      
      if (success) {
        toast.success(task ? "Task updated successfully!" : "Task created successfully!");
        onClose();
      } else {
        toast.error("Failed to save task. Please try again.");
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("An error occurred while saving the task");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "FileText" },
    { id: "call", label: "Call Details", icon: "Phone" },
    { id: "meeting", label: "Meeting Details", icon: "Users" },
    { id: "notes", label: "Notes & Follow-up", icon: "StickyNote" }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ApperIcon name="CheckCircle" className="w-6 h-6" />
                <h2 className="text-lg font-semibold">
                  {task ? "Edit Task" : "New Task"}
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

          {/* Tabs */}
          <div className="bg-slate-50 px-6 py-3 border-b">
            <div className="flex space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white text-secondary-600 shadow-sm"
                      : "text-slate-600 hover:text-secondary-600 hover:bg-white/50"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Task Name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="Brief task name (optional)"
                  />
                  
                  <FormField
                    label="Subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange("subject")}
                    error={errors.subject}
                    placeholder="What needs to be done?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Priority"
                    type="select"
                    id="priority"
                    value={formData.priority}
                    onChange={handleChange("priority")}
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority} value={priority}>
                        {priority} Priority
                      </option>
                    ))}
                  </FormField>
                  
                  <FormField
                    label="Status"
                    type="select"
                    id="status"
                    value={formData.status}
                    onChange={handleChange("status")}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </FormField>
                  
<FormField
                    label="Due Date & Time"
                    type="input"
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange("dueDate")}
                    error={errors.dueDate}
                    placeholder="Select due date"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Company"
                    type="select"
                    id="companyId"
                    value={formData.companyId}
                    onChange={handleChange("companyId")}
                  >
                    <option value="">Select company (optional)</option>
                    {companies.map(company => (
                      <option key={company.Id} value={company.Id}>
                        {company.name_c || company.name}
                      </option>
                    ))}
                  </FormField>
                  
                  <FormField
                    label="Contact"
                    type="select"
                    id="contactId"
                    value={formData.contactId}
                    onChange={handleChange("contactId")}
                  >
                    <option value="">Select contact (optional)</option>
                    {contacts.map(contact => (
                      <option key={contact.Id} value={contact.Id}>
                        {`${contact.first_name_c || contact.firstName || ""} ${contact.last_name_c || contact.lastName || ""}`.trim()}
                      </option>
                    ))}
                  </FormField>
                </div>

                <FormField
                  label="Tags"
                  id="tags"
                  value={formData.tags}
                  onChange={handleChange("tags")}
                  placeholder="Comma-separated tags (e.g., urgent, client-call, follow-up)"
                />
              </div>
            )}

            {/* Call Details Tab */}
            {activeTab === "call" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ApperIcon name="Phone" className="w-5 h-5 text-secondary-600" />
                  <h3 className="text-lg font-medium">Call Information</h3>
                </div>
                
                <FormField
                  label="Call Details"
                  type="textarea"
                  id="callDetails"
                  value={formData.callDetails}
                  onChange={handleChange("callDetails")}
                  placeholder="Record call notes, outcomes, next steps..."
                  rows={8}
                />
              </div>
            )}

            {/* Meeting Details Tab */}
            {activeTab === "meeting" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ApperIcon name="Users" className="w-5 h-5 text-secondary-600" />
                  <h3 className="text-lg font-medium">Meeting Information</h3>
                </div>
                
                <FormField
                  label="Meeting Details"
                  type="textarea"
                  id="meetingDetails"
                  value={formData.meetingDetails}
                  onChange={handleChange("meetingDetails")}
                  placeholder="Meeting agenda, attendees, discussion points, action items..."
                  rows={8}
                />
              </div>
            )}

            {/* Notes & Follow-up Tab */}
            {activeTab === "notes" && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ApperIcon name="StickyNote" className="w-5 h-5 text-secondary-600" />
                  <h3 className="text-lg font-medium">Additional Notes</h3>
                </div>
                
                <FormField
                  label="General Notes"
                  type="textarea"
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange("notes")}
                  placeholder="Additional notes, context, or important information..."
                  rows={6}
                />
                
                <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    id="followUp"
                    checked={formData.followUp}
                    onChange={handleChange("followUp")}
                    className="w-4 h-4 text-secondary-600 bg-gray-100 border-gray-300 rounded focus:ring-secondary-500 focus:ring-2"
                  />
                  <label htmlFor="followUp" className="flex items-center text-sm font-medium text-amber-800">
                    <ApperIcon name="Flag" className="w-4 h-4 mr-2" />
                    This task requires follow-up action
                  </label>
                </div>
              </div>
            )}

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
                    <span>{task ? "Update" : "Create"}</span>
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

export default TaskForm;