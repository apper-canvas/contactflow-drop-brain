import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import { salesRepsService } from "@/services/api/salesRepsService";

const SalesRepForm = ({ salesRep, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    user_id_c: "",
    territory_c: "",
    region_c: "",
    target_amount_c: "",
    achievement_percentage_c: "",
    start_date_c: "",
    is_active_c: true
  });
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    loadAvailableUsers();
    if (salesRep) {
      setFormData({
        user_id_c: salesRep.user_id_c || "",
        territory_c: salesRep.territory_c || "",
        region_c: salesRep.region_c || "",
        target_amount_c: salesRep.target_amount_c || "",
        achievement_percentage_c: salesRep.achievement_percentage_c || "",
        start_date_c: salesRep.start_date_c ? salesRep.start_date_c.split('T')[0] : "",
        is_active_c: salesRep.is_active_c !== undefined ? salesRep.is_active_c : true
      });
    }
  }, [salesRep]);

  const loadAvailableUsers = async () => {
    try {
      const users = await salesRepsService.getAvailableUsers();
      setAvailableUsers(users);
    } catch (err) {
      toast.error("Failed to load available users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data with proper formatting
      const submitData = {
        ...formData,
        target_amount_c: parseFloat(formData.target_amount_c) || 0,
        achievement_percentage_c: parseFloat(formData.achievement_percentage_c) || 0,
        user_id_c: parseInt(formData.user_id_c)
      };

      if (salesRep) {
        await salesRepsService.update(salesRep.Id, submitData);
        toast.success("Sales representative updated successfully");
      } else {
        await salesRepsService.create(submitData);
        toast.success("Sales representative created successfully");
      }
      
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to save sales representative");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {salesRep ? "Edit Sales Representative" : "Add Sales Representative"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="user_id_c">User *</Label>
                <Select
                  id="user_id_c"
                  value={formData.user_id_c}
                  onChange={(e) => handleChange("user_id_c", e.target.value)}
                  disabled={loadingUsers}
                  required
                >
                  <option value="">
                    {loadingUsers ? "Loading users..." : "Select a user"}
                  </option>
                  {availableUsers.map(user => (
                    <option key={user.Id} value={user.Id}>
                      {user.Name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="territory_c">Territory *</Label>
                <Input
                  type="text"
                  id="territory_c"
                  value={formData.territory_c}
                  onChange={(e) => handleChange("territory_c", e.target.value)}
                  placeholder="e.g., North America, Europe, Asia-Pacific"
                  required
                />
              </div>

              <div>
                <Label htmlFor="region_c">Region *</Label>
                <Input
                  type="text"
                  id="region_c"
                  value={formData.region_c}
                  onChange={(e) => handleChange("region_c", e.target.value)}
                  placeholder="e.g., West Coast, East Coast, Central"
                  required
                />
              </div>

              <div>
                <Label htmlFor="target_amount_c">Target Amount ($)</Label>
                <Input
                  type="number"
                  id="target_amount_c"
                  value={formData.target_amount_c}
                  onChange={(e) => handleChange("target_amount_c", e.target.value)}
                  placeholder="Annual sales target"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="achievement_percentage_c">Achievement Percentage (%)</Label>
                <Input
                  type="number"
                  id="achievement_percentage_c"
                  value={formData.achievement_percentage_c}
                  onChange={(e) => handleChange("achievement_percentage_c", e.target.value)}
                  placeholder="Current achievement percentage"
                  min="0"
                  max="200"
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="start_date_c">Start Date</Label>
                <Input
                  type="date"
                  id="start_date_c"
                  value={formData.start_date_c}
                  onChange={(e) => handleChange("start_date_c", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="is_active_c">Status</Label>
                <Select
                  id="is_active_c"
                  value={formData.is_active_c.toString()}
                  onChange={(e) => handleChange("is_active_c", e.target.value === "true")}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white"
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                      {salesRep ? "Update" : "Create"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SalesRepForm;