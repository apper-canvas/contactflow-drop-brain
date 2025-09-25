import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import SalesRepForm from "@/components/organisms/SalesRepForm";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { salesRepsService } from "@/services/api/salesRepsService";

const SalesRepsPage = () => {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSalesRep, setEditingSalesRep] = useState(null);

  useEffect(() => {
    loadSalesReps();
  }, []);

  const loadSalesReps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salesRepsService.getAll();
      setSalesReps(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load sales representatives");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sales representative?")) {
      try {
        await salesRepsService.delete(id);
        setSalesReps(prev => prev.filter(rep => rep.Id !== id));
        toast.success("Sales representative deleted successfully");
      } catch (err) {
        toast.error("Failed to delete sales representative");
      }
    }
  };

  const handleEdit = (salesRep) => {
    setEditingSalesRep(salesRep);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSalesRep(null);
    loadSalesReps();
  };

  const filteredSalesReps = salesReps.filter(rep =>
rep.user?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.territory_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.region_c?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSalesReps} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Sales Representatives
          </h1>
          <p className="text-slate-600 mt-2">Manage your sales team members</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white shadow-lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add Sales Rep
        </Button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search sales representatives..."
        />
      </motion.div>

      {/* Sales Reps Grid */}
      {filteredSalesReps.length === 0 ? (
        <Empty
          title="No sales representatives found"
          description="Add your first sales representative to get started"
          action={
            <Button onClick={() => setShowForm(true)}>
              <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
              Add Sales Rep
            </Button>
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSalesReps.map((salesRep, index) => (
            <motion.div
              key={salesRep.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
{salesRep.user?.Name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {salesRep.user?.Name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-slate-600">{salesRep.territory_c}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(salesRep)}
                      className="p-2 text-slate-400 hover:text-secondary-600 transition-colors rounded-lg hover:bg-secondary-50"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(salesRep.Id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                    {salesRep.region_c}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="Target" className="w-4 h-4 mr-2" />
                    Target: ${salesRep.target_amount_c?.toLocaleString() || '0'}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <ApperIcon name="TrendingUp" className="w-4 h-4 mr-2" />
                    Achievement: {salesRep.achievement_percentage_c || 0}%
                  </div>
                  {salesRep.start_date_c && (
                    <div className="flex items-center text-sm text-slate-600">
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                      Started: {new Date(salesRep.start_date_c).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Form Modal */}
      {showForm && (
        <SalesRepForm
          salesRep={editingSalesRep}
          onSuccess={handleFormSuccess}
          onClose={() => {
            setShowForm(false);
            setEditingSalesRep(null);
          }}
        />
      )}
    </div>
  );
};

export default SalesRepsPage;