import { toast } from "react-toastify";

class TasksService {
  constructor() {
    this.tableName = 'task_c';
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    try {
      await this.delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "call_details_c"}},
          {"field": {"Name": "meeting_details_c"}},
          {"field": {"Name": "follow_up_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "contact_id_c"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      await this.delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "call_details_c"}},
          {"field": {"Name": "meeting_details_c"}},
          {"field": {"Name": "follow_up_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "contact_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

async create(taskData) {
    try {
      await this.delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Validate required data
      if (!taskData.subject_c?.trim()) {
        toast.error("Subject is required");
        return null;
      }

      // Only include updateable fields for create operation
      const params = {
        records: [{
          Name: taskData.Name || "",
          Tags: taskData.Tags || "",
          subject_c: taskData.subject_c || "",
          due_date_c: taskData.due_date_c || null,
          priority_c: taskData.priority_c || "Medium",
          status_c: taskData.status_c || "Not Started",
          notes_c: taskData.notes_c || "",
          call_details_c: taskData.call_details_c || "",
          meeting_details_c: taskData.meeting_details_c || "",
          follow_up_c: Boolean(taskData.follow_up_c),
          company_id_c: taskData.company_id_c ? parseInt(taskData.company_id_c) : null,
          contact_id_c: taskData.contact_id_c ? parseInt(taskData.contact_id_c) : null
        }]
      };

      console.log("Creating task with data:", params);
      const response = await apperClient.createRecord(this.tableName, params);
      console.log("Create task response:", response);

      if (!response.success) {
        console.error("Error creating task:", response.message);
        toast.error(response.message || "Failed to create task");
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.errors && Array.isArray(record.errors)) {
              record.errors.forEach(error => {
                const errorMsg = typeof error === 'object' && error.fieldLabel 
                  ? `${error.fieldLabel}: ${error.message || error}` 
                  : error.message || error;
                toast.error(errorMsg);
              });
            }
            if (record.message) {
              toast.error(record.message);
            }
          });
          return null;
        }

        if (successful.length > 0 && successful[0].data) {
          return successful[0].data;
        }
      }
      
      toast.error("No data returned from server");
      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error.message || error);
      toast.error("Network error occurred while creating task");
      return null;
    }
  }

  async update(id, taskData) {
    try {
      await this.delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields for update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.Name || taskData.name || "",
          Tags: taskData.Tags || taskData.tags || "",
          subject_c: taskData.subject_c || taskData.subject || "",
          due_date_c: taskData.due_date_c || taskData.dueDate || null,
          priority_c: taskData.priority_c || taskData.priority || "Medium",
          status_c: taskData.status_c || taskData.status || "Not Started",
          notes_c: taskData.notes_c || taskData.notes || "",
          call_details_c: taskData.call_details_c || taskData.callDetails || "",
          meeting_details_c: taskData.meeting_details_c || taskData.meetingDetails || "",
          follow_up_c: taskData.follow_up_c || taskData.followUp || false,
          company_id_c: taskData.company_id_c || taskData.companyId ? parseInt(taskData.company_id_c || taskData.companyId) : null,
          contact_id_c: taskData.contact_id_c || taskData.contactId ? parseInt(taskData.contact_id_c || taskData.contactId) : null
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error updating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      await this.delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error deleting task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const tasksService = new TasksService();