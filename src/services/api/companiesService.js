export const companiesService = {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_ids_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
],
        where: [
          {
            "FieldName": "CreatedBy",
            "Operator": "EqualTo", 
            "Values": [window.ApperSDK?.currentUser?.userId || ""],
            "Include": true
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database fields to UI field names
      const transformedData = response.data?.map(company => ({
        Id: company.Id,
        name: company.name_c || '',
        industry: company.industry_c || '',
        size: company.size_c || '',
        website: company.website_c || '',
        description: company.description_c || '',
        contactIds: company.contact_ids_c ? company.contact_ids_c.split(',').filter(Boolean) : [],
        createdAt: company.created_at_c || '',
        updatedAt: company.updated_at_c || ''
      })) || [];
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_ids_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('company_c', id, params);
      
      if (!response?.data) {
        throw new Error("Company not found");
      }
      
      // Transform database fields to UI field names
      const company = response.data;
      return {
        Id: company.Id,
        name: company.name_c || '',
        industry: company.industry_c || '',
        size: company.size_c || '',
        website: company.website_c || '',
        description: company.description_c || '',
        contactIds: company.contact_ids_c ? company.contact_ids_c.split(',').filter(Boolean) : [],
        createdAt: company.created_at_c || '',
        updatedAt: company.updated_at_c || ''
      };
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(companyData) {
    try {
      const apperClient = this.getClient();
      
      // Transform UI field names to database fields (only Updateable fields)
      const params = {
        records: [{
          name_c: companyData.name || '',
          industry_c: companyData.industry || '',
          size_c: companyData.size || '',
          website_c: companyData.website || '',
          description_c: companyData.description || '',
          contact_ids_c: companyData.contactIds ? companyData.contactIds.join(',') : '',
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const company = successful[0].data;
          return {
            Id: company.Id,
            name: company.name_c || '',
            industry: company.industry_c || '',
            size: company.size_c || '',
            website: company.website_c || '',
            description: company.description_c || '',
            contactIds: company.contact_ids_c ? company.contact_ids_c.split(',').filter(Boolean) : [],
            createdAt: company.created_at_c || '',
            updatedAt: company.updated_at_c || ''
          };
        }
      }
      throw new Error("Failed to create company");
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, companyData) {
    try {
      const apperClient = this.getClient();
      
      // Transform UI field names to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: companyData.name || '',
          industry_c: companyData.industry || '',
          size_c: companyData.size || '',
          website_c: companyData.website || '',
          description_c: companyData.description || '',
          contact_ids_c: companyData.contactIds ? companyData.contactIds.join(',') : '',
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} companies:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const company = successful[0].data;
          return {
            Id: company.Id,
            name: company.name_c || '',
            industry: company.industry_c || '',
            size: company.size_c || '',
            website: company.website_c || '',
            description: company.description_c || '',
            contactIds: company.contact_ids_c ? company.contact_ids_c.split(',').filter(Boolean) : [],
            createdAt: company.created_at_c || '',
            updatedAt: company.updated_at_c || ''
          };
        }
      }
      throw new Error("Failed to update company");
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} companies:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return { success: successful.length > 0 };
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      throw error;
    }
}
};