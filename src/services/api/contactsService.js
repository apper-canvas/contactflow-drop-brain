export const contactsService = {
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"name": "company_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database fields to UI field names
      const transformedData = response.data?.map(contact => ({
        Id: contact.Id,
        firstName: contact.first_name_c || '',
        lastName: contact.last_name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        companyId: contact.company_id_c?.Id || '',
        title: contact.title_c || '',
        notes: contact.notes_c || '',
        createdAt: contact.created_at_c || '',
        updatedAt: contact.updated_at_c || ''
      })) || [];
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getClient();
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"name": "company_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('contact_c', id, params);
      
      if (!response?.data) {
        throw new Error("Contact not found");
      }
      
      // Transform database fields to UI field names
      const contact = response.data;
      return {
        Id: contact.Id,
        firstName: contact.first_name_c || '',
        lastName: contact.last_name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        companyId: contact.company_id_c?.Id || '',
        title: contact.title_c || '',
        notes: contact.notes_c || '',
        createdAt: contact.created_at_c || '',
        updatedAt: contact.updated_at_c || ''
      };
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const apperClient = this.getClient();
      
      // Transform UI field names to database fields (only Updateable fields)
// Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          first_name_c: contactData.firstName || '',
          last_name_c: contactData.lastName || '',
          email_c: contactData.email || '',
          phone_c: contactData.phone || '',
          company_id_c: contactData.companyId ? parseInt(contactData.companyId) : null,
          title_c: contactData.title || '',
          notes_c: contactData.notes || '',
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const contact = successful[0].data;
          return {
            Id: contact.Id,
            firstName: contact.first_name_c || '',
            lastName: contact.last_name_c || '',
            email: contact.email_c || '',
            phone: contact.phone_c || '',
            companyId: contact.company_id_c?.Id || '',
            title: contact.title_c || '',
            notes: contact.notes_c || '',
            createdAt: contact.created_at_c || '',
            updatedAt: contact.updated_at_c || ''
          };
        }
      }
      throw new Error("Failed to create contact");
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = this.getClient();
      
      // Transform UI field names to database fields (only Updateable fields)
// Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          first_name_c: contactData.firstName || '',
          last_name_c: contactData.lastName || '',
          email_c: contactData.email || '',
          phone_c: contactData.phone || '',
          company_id_c: contactData.companyId ? parseInt(contactData.companyId) : null,
          title_c: contactData.title || '',
          notes_c: contactData.notes || '',
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const contact = successful[0].data;
          return {
            Id: contact.Id,
            firstName: contact.first_name_c || '',
            lastName: contact.last_name_c || '',
            email: contact.email_c || '',
            phone: contact.phone_c || '',
            companyId: contact.company_id_c?.Id || '',
            title: contact.title_c || '',
            notes: contact.notes_c || '',
            createdAt: contact.created_at_c || '',
            updatedAt: contact.updated_at_c || ''
          };
        }
      }
      throw new Error("Failed to update contact");
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return { success: successful.length > 0 };
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  }
};