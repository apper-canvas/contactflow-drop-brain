import mockSalesReps from '../mockData/salesReps.json';

// Mock users data for lookup functionality
const mockUsers = [
  { Id: 1, Name: "John Smith" },
  { Id: 2, Name: "Sarah Johnson" },
  { Id: 3, Name: "Michael Brown" },
  { Id: 4, Name: "Emily Davis" },
  { Id: 5, Name: "David Wilson" },
  { Id: 6, Name: "Lisa Anderson" },
  { Id: 7, Name: "James Miller" },
  { Id: 8, Name: "Jennifer Taylor" },
  { Id: 9, Name: "Robert Garcia" },
  { Id: 10, Name: "Amanda Martinez" },
  { Id: 11, Name: "Christopher Lee" },
  { Id: 12, Name: "Michelle White" }
];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let salesRepsData = [...mockSalesReps];

const salesRepsService = {
  async getAll() {
    await delay(300);
    
    // Add user lookup data to each sales rep
    return salesRepsData.map(rep => ({
      ...rep,
      user: mockUsers.find(user => user.Id === rep.user_id_c) || null
    }));
  },

  async getById(id) {
    await delay(200);
    
    const salesRep = salesRepsData.find(rep => rep.Id === parseInt(id));
    if (!salesRep) {
      throw new Error('Sales representative not found');
    }

    // Add user lookup data
    return {
      ...salesRep,
      user: mockUsers.find(user => user.Id === salesRep.user_id_c) || null
    };
  },

  async create(salesRepData) {
    await delay(400);
    
    // Validate required fields
    if (!salesRepData.user_id_c) {
      throw new Error('User selection is required');
    }
    if (!salesRepData.territory_c) {
      throw new Error('Territory is required');
    }
    if (!salesRepData.region_c) {
      throw new Error('Region is required');
    }

    // Check if user is already assigned as sales rep
    const existingAssignment = salesRepsData.find(rep => 
      rep.user_id_c === salesRepData.user_id_c && rep.is_active_c
    );
    if (existingAssignment) {
      throw new Error('This user is already assigned as an active sales representative');
    }

    const newSalesRep = {
      Id: Math.max(...salesRepsData.map(rep => rep.Id), 0) + 1,
      user_id_c: salesRepData.user_id_c,
      territory_c: salesRepData.territory_c,
      region_c: salesRepData.region_c,
      target_amount_c: salesRepData.target_amount_c || 0,
      achievement_percentage_c: salesRepData.achievement_percentage_c || 0,
      start_date_c: salesRepData.start_date_c || new Date().toISOString().split('T')[0],
      is_active_c: salesRepData.is_active_c !== undefined ? salesRepData.is_active_c : true,
      created_at_c: new Date().toISOString(),
      updated_at_c: new Date().toISOString()
    };

    salesRepsData.push(newSalesRep);

    // Return with user lookup data
    return {
      ...newSalesRep,
      user: mockUsers.find(user => user.Id === newSalesRep.user_id_c) || null
    };
  },

  async update(id, updates) {
    await delay(350);
    
    const index = salesRepsData.findIndex(rep => rep.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Sales representative not found');
    }

    // Validate required fields
    if (updates.user_id_c && !updates.user_id_c) {
      throw new Error('User selection is required');
    }
    if (updates.territory_c !== undefined && !updates.territory_c) {
      throw new Error('Territory is required');
    }
    if (updates.region_c !== undefined && !updates.region_c) {
      throw new Error('Region is required');
    }

    // Check for duplicate user assignment (excluding current record)
    if (updates.user_id_c) {
      const existingAssignment = salesRepsData.find(rep => 
        rep.Id !== parseInt(id) && 
        rep.user_id_c === updates.user_id_c && 
        rep.is_active_c
      );
      if (existingAssignment) {
        throw new Error('This user is already assigned as an active sales representative');
      }
    }

    const updatedSalesRep = {
      ...salesRepsData[index],
      ...updates,
      updated_at_c: new Date().toISOString()
    };

    salesRepsData[index] = updatedSalesRep;

    // Return with user lookup data
    return {
      ...updatedSalesRep,
      user: mockUsers.find(user => user.Id === updatedSalesRep.user_id_c) || null
    };
  },

  async delete(id) {
    await delay(250);
    
    const index = salesRepsData.findIndex(rep => rep.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Sales representative not found');
    }

    salesRepsData.splice(index, 1);
    return { success: true };
  },

  async getAvailableUsers() {
    await delay(200);
    
    // Return all users - the form validation will handle duplicate checking
    return [...mockUsers];
  }
};

export { salesRepsService };