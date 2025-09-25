import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { leadsService } from "@/services/api/leadsService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import LeadCard from "@/components/molecules/LeadCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import LeadForm from "@/components/organisms/LeadForm";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter leads based on search term
    if (!searchTerm.trim()) {
      setFilteredLeads(leads);
    } else {
      const filtered = leads.filter((lead) => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
        return (
          fullName.includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower) ||
lead.phone?.includes(searchTerm) ||
          (lead.company?.Name || lead.company)?.toLowerCase().includes(searchLower) ||
          lead.status?.toLowerCase().includes(searchLower) ||
          lead.leadSource?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredLeads(filtered);
    }
  }, [searchTerm, leads]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const leadsData = await leadsService.getAll();
      setLeads(leadsData);
      setFilteredLeads(leadsData);
    } catch (err) {
      setError(err.message);
      console.error("Error loading leads data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsFormOpen(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleDeleteLead = async (lead) => {
    if (window.confirm(`Are you sure you want to delete ${lead.firstName} ${lead.lastName}?`)) {
      try {
        await leadsService.delete(lead.Id);
        toast.success("Lead deleted successfully");
        loadData();
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error("Failed to delete lead");
      }
    }
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (selectedLead) {
        await leadsService.update(selectedLead.Id, leadData);
        toast.success("Lead updated successfully");
      } else {
        await leadsService.create(leadData);
        toast.success("Lead created successfully");
      }
      setIsFormOpen(false);
      setSelectedLead(null);
      loadData();
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error(selectedLead ? "Failed to update lead" : "Failed to create lead");
    }
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handlePhoneClick = (phone) => {
    window.open(`tel:${phone}`, '_blank');
  };

  const exportLeads = () => {
    if (leads.length === 0) {
      toast.warn("No leads to export");
      return;
    }

    const csvHeaders = [
      "Name",
      "First Name",
      "Last Name", 
      "Email",
      "Phone",
      "Company",
      "Status",
      "Lead Source"
    ];

    const csvData = leads.map(lead => [
      lead.name || '',
      lead.firstName || '',
      lead.lastName || '',
      lead.email || '',
lead.phone || '',
      lead.company?.Name || lead.company || '',
      lead.status || '',
      lead.leadSource || ''
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => 
        row.map(field => 
          typeof field === 'string' && field.includes(',') 
            ? `"${field}"` 
            : field
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${leads.length} leads to CSV`);
  };

  if (loading) return <Loading message="Loading leads..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-800 bg-clip-text text-transparent">
            Leads
          </h1>
          <p className="text-slate-600 mt-1">
            Track and manage your sales leads
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={exportLeads}
            disabled={leads.length === 0}
            className="shadow-sm"
          >
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleAddLead}
            className="shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </motion.div>

      {/* Search and Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search leads by name, email, phone, company, or status..."
          className="flex-1 max-w-md"
        />
        
        <div className="flex items-center space-x-6 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="TrendingUp" className="w-4 h-4" />
            <span>
              {filteredLeads.length} of {leads.length} leads
            </span>
          </div>
          
          {searchTerm && (
            <button
              className="text-secondary-600 hover:text-secondary-800 font-medium"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </button>
          )}
        </div>
      </motion.div>

      {/* Leads Grid */}
      <AnimatePresence mode="wait">
        {filteredLeads.length === 0 ? (
          <Empty
            key="empty"
            title={searchTerm ? "No leads found" : "No leads yet"}
            message={
              searchTerm 
                ? "Try adjusting your search terms or add a new lead."
                : "Start building your leads pipeline by adding your first lead."
            }
            actionLabel="Add First Lead"
            onAction={handleAddLead}
            icon="TrendingUp"
          />
        ) : (
          <motion.div
            key="leads"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredLeads.map((lead, index) => (
              <motion.div
                key={lead.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <LeadCard
                  lead={lead}
                  onEdit={handleEditLead}
                  onDelete={handleDeleteLead}
                  onEmailClick={handleEmailClick}
                  onPhoneClick={handlePhoneClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Form Modal */}
      <LeadForm
        lead={selectedLead}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveLead}
      />
    </div>
  );
};

export default LeadsPage;