// Deals service using ApperClient for deals_c table operations
// Field mappings: dealName->Name_c, company->company_id_c, dealValue->Value_c, 
// expectedCloseDate->CloseDate_c, stage->Status_c, tags->Tags

// Utility function to simulate API delay for consistent UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient for database operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all deals with optional filtering and sorting
export const getAll = async (filters = {}) => {
  try {
    await delay(300);
    
    const apperClient = getApperClient();
    const params = {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "Owner"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "CreatedBy"}},
        {"field": {"Name": "ModifiedOn"}},
        {"field": {"Name": "ModifiedBy"}},
        {"field": {"Name": "Name_c"}},
        {"field": {"Name": "Value_c"}},
        {"field": {"Name": "Status_c"}},
{"field": {"Name": "CloseDate_c"}},
        {"field": {"Name": "company_id_c"}},
        {"field": {"Name": "contact_id_c"}},
        {"field": {"Name": "sales_rep_id_c"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };

    // Add search filter if provided
    if (filters.search) {
      params.where = [
        {"FieldName": "Name_c", "Operator": "Contains", "Values": [filters.search]},
        {"FieldName": "Tags", "Operator": "Contains", "Values": [filters.search]},
        {"FieldName": "Status_c", "Operator": "Contains", "Values": [filters.search]}
      ];
    }

    const response = await apperClient.fetchRecords('deals_c', params);
    
    if (!response.success) {
      console.error("Error fetching deals:", response.message);
      throw new Error(response.message || 'Failed to fetch deals');
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching deals:", error?.response?.data?.message || error);
    throw error;
  }
};

// Get single deal by ID
export const getById = async (dealId) => {
  try {
    await delay(200);
    
    const apperClient = getApperClient();
    const params = {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "Owner"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "CreatedBy"}},
        {"field": {"Name": "ModifiedOn"}},
        {"field": {"Name": "ModifiedBy"}},
        {"field": {"Name": "Name_c"}},
        {"field": {"Name": "Value_c"}},
        {"field": {"Name": "Status_c"}},
        {"field": {"Name": "CloseDate_c"}},
        {"field": {"Name": "company_id_c"}},
{"field": {"Name": "contact_id_c"}},
        {"field": {"Name": "sales_rep_id_c"}}
      ]
    };

    const response = await apperClient.getRecordById('deals_c', dealId, params);
    
    if (!response.success) {
      console.error(`Error fetching deal ${dealId}:`, response.message);
      throw new Error(response.message || 'Failed to fetch deal');
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching deal ${dealId}:`, error?.response?.data?.message || error);
    throw error;
  }
};

// Create new deal(s) - only includes Updateable fields
export const create = async (dealData) => {
  try {
    await delay(400);
    
    const apperClient = getApperClient();
    
    // Prepare deal data with only Updateable fields
    const recordData = {
      Name_c: dealData.Name_c || '',
      Value_c: parseInt(dealData.Value_c) || 0,
      Status_c: dealData.Status_c || 'Prospecting',
      CloseDate_c: dealData.CloseDate_c || null,
      Tags: dealData.Tags || ''
    };

// Add lookup fields if provided (as integers)
    if (dealData.company_id_c) {
      recordData.company_id_c = parseInt(dealData.company_id_c);
    }
    if (dealData.contact_id_c) {
      recordData.contact_id_c = parseInt(dealData.contact_id_c);
    }
    if (dealData.sales_rep_id_c) {
      recordData.sales_rep_id_c = parseInt(dealData.sales_rep_id_c);
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.createRecord('deals_c', params);
    
    if (!response.success) {
      console.error("Error creating deal:", response.message);
      throw new Error(response.message || 'Failed to create deal');
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} deals:`, JSON.stringify(failed));
        const errorMessage = failed[0].message || 'Failed to create deal';
        throw new Error(errorMessage);
      }
      
      return successful.length > 0 ? successful[0].data : null;
    }
    
    return null;
  } catch (error) {
    console.error("Error creating deal:", error?.response?.data?.message || error);
    throw error;
  }
};

// Update existing deal - only includes Updateable fields
export const update = async (dealId, dealData) => {
  try {
    await delay(400);
    
    const apperClient = getApperClient();
    
    // Prepare update data with only Updateable fields
    const recordData = {
      Id: parseInt(dealId)
    };

    // Only include fields that are being updated
    if (dealData.Name_c !== undefined) recordData.Name_c = dealData.Name_c;
    if (dealData.Value_c !== undefined) recordData.Value_c = parseInt(dealData.Value_c);
    if (dealData.Status_c !== undefined) recordData.Status_c = dealData.Status_c;
    if (dealData.CloseDate_c !== undefined) recordData.CloseDate_c = dealData.CloseDate_c;
    if (dealData.Tags !== undefined) recordData.Tags = dealData.Tags;
// Handle lookup fields
    if (dealData.company_id_c !== undefined) {
      recordData.company_id_c = dealData.company_id_c ? parseInt(dealData.company_id_c) : null;
    }
    if (dealData.contact_id_c !== undefined) {
      recordData.contact_id_c = dealData.contact_id_c ? parseInt(dealData.contact_id_c) : null;
    }
    if (dealData.sales_rep_id_c !== undefined) {
      recordData.sales_rep_id_c = dealData.sales_rep_id_c ? parseInt(dealData.sales_rep_id_c) : null;
    }
    if (dealData.contact_id_c !== undefined) {
      recordData.contact_id_c = dealData.contact_id_c ? parseInt(dealData.contact_id_c) : null;
    }

    const params = {
      records: [recordData]
    };

    const response = await apperClient.updateRecord('deals_c', params);
    
    if (!response.success) {
      console.error("Error updating deal:", response.message);
      throw new Error(response.message || 'Failed to update deal');
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} deals:`, JSON.stringify(failed));
        const errorMessage = failed[0].message || 'Failed to update deal';
        throw new Error(errorMessage);
      }
      
      return successful.length > 0 ? successful[0].data : null;
    }
    
    return null;
  } catch (error) {
    console.error("Error updating deal:", error?.response?.data?.message || error);
    throw error;
  }
};

// Delete deal(s)
export const remove = async (dealId) => {
  try {
    await delay(300);
    
    const apperClient = getApperClient();
    const params = {
      RecordIds: Array.isArray(dealId) ? dealId : [dealId]
    };

    const response = await apperClient.deleteRecord('deals_c', params);
    
    if (!response.success) {
      console.error("Error deleting deal:", response.message);
      throw new Error(response.message || 'Failed to delete deal');
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} deals:`, JSON.stringify(failed));
        const errorMessage = failed[0].message || 'Failed to delete deal';
        throw new Error(errorMessage);
      }
      
      return successful.length > 0;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting deal:", error?.response?.data?.message || error);
    throw error;
  }
};

// Export service object for backward compatibility
const dealsService = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
  remove
};

export { dealsService };
export default dealsService;