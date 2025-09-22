export const leadsService = {
  // Initialize ApperClient
  getClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  },

  async getAll() {
    try {
      const apperClient = this.getClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "lead_source_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('leads_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database fields to UI field names
      const transformedData = response.data?.map(lead => ({
        Id: lead.Id,
        name: lead.Name || '',
        tags: lead.Tags || '',
        firstName: lead.first_name_c || '',
        lastName: lead.last_name_c || '',
        email: lead.email_c || '',
        phone: lead.phone_c || '',
        company: lead.company_c || '',
        status: lead.status_c || '',
        leadSource: lead.lead_source_c || '',
        createdOn: lead.CreatedOn || '',
        modifiedOn: lead.ModifiedOn || ''
      })) || [];
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching leads:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "lead_source_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById('leads_c', id, params);
      
      if (!response?.data) {
        throw new Error("Lead not found");
      }
      
      // Transform database fields to UI field names
      const lead = response.data;
      return {
        Id: lead.Id,
        name: lead.Name || '',
        tags: lead.Tags || '',
        firstName: lead.first_name_c || '',
        lastName: lead.last_name_c || '',
        email: lead.email_c || '',
        phone: lead.phone_c || '',
        company: lead.company_c || '',
        status: lead.status_c || '',
        leadSource: lead.lead_source_c || '',
        createdOn: lead.CreatedOn || '',
        modifiedOn: lead.ModifiedOn || ''
      };
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(leadData) {
    try {
      const apperClient = this.getClient();
      
      // Transform UI field names to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: leadData.name || '',
          Tags: leadData.tags || '',
          first_name_c: leadData.firstName || '',
          last_name_c: leadData.lastName || '',
          email_c: leadData.email || '',
          phone_c: leadData.phone || '',
          company_c: leadData.company || '',
          status_c: leadData.status || '',
          lead_source_c: leadData.leadSource || ''
        }]
      };
      
      const response = await apperClient.createRecord('leads_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} leads:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const lead = successful[0].data;
          return {
            Id: lead.Id,
            name: lead.Name || '',
            tags: lead.Tags || '',
            firstName: lead.first_name_c || '',
            lastName: lead.last_name_c || '',
            email: lead.email_c || '',
            phone: lead.phone_c || '',
            company: lead.company_c || '',
            status: lead.status_c || '',
            leadSource: lead.lead_source_c || '',
            createdOn: lead.CreatedOn || '',
            modifiedOn: lead.ModifiedOn || ''
          };
        }
      }
      throw new Error("Failed to create lead");
    } catch (error) {
      console.error("Error creating lead:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, leadData) {
    try {
      const apperClient = this.getClient();
      
      // Transform UI field names to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          Name: leadData.name || '',
          Tags: leadData.tags || '',
          first_name_c: leadData.firstName || '',
          last_name_c: leadData.lastName || '',
          email_c: leadData.email || '',
          phone_c: leadData.phone || '',
          company_c: leadData.company || '',
          status_c: leadData.status || '',
          lead_source_c: leadData.leadSource || ''
        }]
      };
      
      const response = await apperClient.updateRecord('leads_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} leads:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const lead = successful[0].data;
          return {
            Id: lead.Id,
            name: lead.Name || '',
            tags: lead.Tags || '',
            firstName: lead.first_name_c || '',
            lastName: lead.last_name_c || '',
            email: lead.email_c || '',
            phone: lead.phone_c || '',
            company: lead.company_c || '',
            status: lead.status_c || '',
            leadSource: lead.lead_source_c || '',
            createdOn: lead.CreatedOn || '',
            modifiedOn: lead.ModifiedOn || ''
          };
        }
      }
      throw new Error("Failed to update lead");
    } catch (error) {
      console.error("Error updating lead:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('leads_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} leads:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return { success: successful.length > 0 };
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting lead:", error?.response?.data?.message || error);
      throw error;
    }
  }
};