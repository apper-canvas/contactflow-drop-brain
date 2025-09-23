import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dealsService } from "@/services/api/dealsService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import DealCard from "@/components/molecules/DealCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import DealForm from "@/components/organisms/DealForm";

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter deals based on search term
    if (!searchTerm.trim()) {
      setFilteredDeals(deals);
    } else {
      const filtered = deals.filter((deal) => {
        const searchLower = searchTerm.toLowerCase();
return (
          deal.Name_c?.toLowerCase().includes(searchLower) ||
          deal.company_id_c?.Name?.toLowerCase().includes(searchLower) ||
          deal.Status_c?.toLowerCase().includes(searchLower) ||
          deal.Owner?.Name?.toLowerCase().includes(searchLower) ||
          deal.Tags?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredDeals(filtered);
    }
  }, [searchTerm, deals]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dealsData = await dealsService.getAll();
      setDeals(dealsData);
      setFilteredDeals(dealsData);
    } catch (err) {
      setError(err.message);
      console.error("Error loading deals data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setIsFormOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setIsFormOpen(true);
  };

  const handleDeleteDeal = async (deal) => {
    if (window.confirm(`Are you sure you want to delete "${deal.dealName}"?`)) {
      try {
await dealsService.delete(deal.Id);
        toast.success("Deal deleted successfully");
        loadData();
      } catch (error) {
        console.error("Error deleting deal:", error);
        toast.error("Failed to delete deal");
      }
    }
  };

  const handleLogActivity = (deal) => {
    // Placeholder for future activity logging functionality
    toast.info(`Activity logging for "${deal.dealName}" - Coming Soon!`);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
await dealsService.update(selectedDeal.Id, dealData);
        toast.success("Deal updated successfully");
      } else {
        await dealsService.create(dealData);
        toast.success("Deal created successfully");
      }
      setIsFormOpen(false);
      setSelectedDeal(null);
      loadData();
    } catch (error) {
      console.error("Error saving deal:", error);
      toast.error(selectedDeal ? "Failed to update deal" : "Failed to create deal");
    }
  };

  const exportDeals = () => {
    if (deals.length === 0) {
      toast.warn("No deals to export");
      return;
    }

    const csvHeaders = [
      "Deal Name",
      "Company",
      "Deal Value",
      "Probability",
      "Expected Close Date",
      "Stage",
      "Assigned Rep",
      "Priority",
      "Tags"
    ];

    const csvData = deals.map(deal => [
deal.Name_c || '',
      deal.company_id_c?.Name || '',
      deal.Value_c || 0,
      deal.Status_c || '',
      deal.CloseDate_c || '',
      deal.Owner?.Name || '',
      deal.Tags || ''
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
    link.setAttribute('download', `deals-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${deals.length} deals to CSV`);
  };

  const getTotalValue = () => {
    return filteredDeals.reduce((sum, deal) => sum + (deal.dealValue || 0), 0);
  };

  const getWeightedValue = () => {
    return filteredDeals.reduce((sum, deal) => {
      return sum + ((deal.dealValue || 0) * (deal.probability || 0) / 100);
    }, 0);
  };

  if (loading) return <Loading message="Loading deals..." />;
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
            Deals
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your sales pipeline and opportunities
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={exportDeals}
            disabled={deals.length === 0}
            className="shadow-sm"
          >
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleAddDeal}
            className="shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </motion.div>

      {/* Search and Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
      >
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search deals by name, company, stage, or rep..."
          className="flex-1 max-w-md"
        />
        
        <div className="flex items-center space-x-6 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Handshake" className="w-4 h-4" />
            <span>
              {filteredDeals.length} of {deals.length} deals
            </span>
          </div>
          
          <div className="hidden sm:flex items-center space-x-2">
            <ApperIcon name="DollarSign" className="w-4 h-4" />
            <span>
              Total: ${getTotalValue().toLocaleString()}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <ApperIcon name="TrendingUp" className="w-4 h-4" />
            <span>
              Weighted: ${getWeightedValue().toLocaleString()}
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

      {/* Deals Grid */}
      <AnimatePresence mode="wait">
        {filteredDeals.length === 0 ? (
          <Empty
            key="empty"
            title={searchTerm ? "No deals found" : "No deals yet"}
            message={
              searchTerm 
                ? "Try adjusting your search terms or add a new deal."
                : "Start building your sales pipeline by adding your first deal."
            }
            actionLabel="Add First Deal"
            onAction={handleAddDeal}
            icon="Handshake"
          />
        ) : (
          <motion.div
            key="deals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredDeals.map((deal, index) => (
              <motion.div
key={deal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <DealCard
                  deal={deal}
                  onEdit={handleEditDeal}
                  onDelete={handleDeleteDeal}
                  onLogActivity={handleLogActivity}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deal Form Modal */}
      <DealForm
        deal={selectedDeal}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveDeal}
      />
    </div>
  );
};

export default DealsPage;