// Mock deals data - replace with ApperClient when deals table becomes available
const mockDeals = [
  {
    Id: 1,
    dealName: "Enterprise CRM Implementation",
    company: "TechCorp Solutions",
    dealValue: 125000,
    probability: 75,
    expectedCloseDate: "2024-03-15",
    stage: "Proposal",
    assignedRep: "Sarah Johnson",
    priority: "High",
    tags: "Enterprise, CRM, Implementation",
    createdOn: "2024-01-15T10:30:00Z",
    modifiedOn: "2024-01-20T14:45:00Z"
  },
  {
    Id: 2,
    dealName: "SaaS Platform Migration",
    company: "DataFlow Inc",
    dealValue: 85000,
    probability: 60,
    expectedCloseDate: "2024-03-22",
    stage: "Negotiation",
    assignedRep: "Michael Chen",
    priority: "Medium",
    tags: "SaaS, Migration, Platform",
    createdOn: "2024-01-18T09:15:00Z",
    modifiedOn: "2024-01-25T11:20:00Z"
  },
  {
    Id: 3,
    dealName: "Mobile App Development",
    company: "StartupXYZ",
    dealValue: 45000,
    probability: 90,
    expectedCloseDate: "2024-03-08",
    stage: "Verbal Commitment",
    assignedRep: "Emma Rodriguez",
    priority: "Critical",
    tags: "Mobile, Development, App",
    createdOn: "2024-01-20T16:00:00Z",
    modifiedOn: "2024-01-28T13:30:00Z"
  },
  {
    Id: 4,
    dealName: "Cloud Infrastructure Setup",
    company: "GlobalTech Ltd",
    dealValue: 200000,
    probability: 40,
    expectedCloseDate: "2024-04-10",
    stage: "Discovery",
    assignedRep: "David Kim",
    priority: "High",
    tags: "Cloud, Infrastructure, Setup",
    createdOn: "2024-01-22T08:45:00Z",
    modifiedOn: "2024-01-30T10:15:00Z"
  },
  {
    Id: 5,
    dealName: "Digital Marketing Campaign",
    company: "BrandBuilders Co",
    dealValue: 35000,
    probability: 80,
    expectedCloseDate: "2024-03-25",
    stage: "Proposal",
    assignedRep: "Lisa Thompson",
    priority: "Medium",
    tags: "Marketing, Digital, Campaign",
    createdOn: "2024-01-25T14:20:00Z",
    modifiedOn: "2024-02-01T16:40:00Z"
  },
  {
    Id: 6,
    dealName: "ERP System Integration",
    company: "Manufacturing Plus",
    dealValue: 180000,
    probability: 55,
    expectedCloseDate: "2024-04-20",
    stage: "Qualification",
    assignedRep: "Robert Wilson",
    priority: "High",
    tags: "ERP, Integration, Manufacturing",
    createdOn: "2024-01-28T11:10:00Z",
    modifiedOn: "2024-02-03T09:25:00Z"
  },
  {
    Id: 7,
    dealName: "Website Redesign Project",
    company: "Fashion Forward",
    dealValue: 25000,
    probability: 70,
    expectedCloseDate: "2024-03-18",
    stage: "Negotiation",
    assignedRep: "Jennifer Martinez",
    priority: "Low",
    tags: "Website, Redesign, Fashion",
    createdOn: "2024-01-30T13:45:00Z",
    modifiedOn: "2024-02-05T15:20:00Z"
  },
  {
    Id: 8,
    dealName: "AI Analytics Solution",
    company: "DataInsights Corp",
    dealValue: 300000,
    probability: 30,
    expectedCloseDate: "2024-05-15",
    stage: "Discovery",
    assignedRep: "Alex Zhang",
    priority: "Critical",
    tags: "AI, Analytics, Solution",
    createdOn: "2024-02-01T10:00:00Z",
    modifiedOn: "2024-02-07T12:30:00Z"
  },
  {
    Id: 9,
    dealName: "Security Audit Services",
    company: "SecureBank Ltd",
    dealValue: 75000,
    probability: 85,
    expectedCloseDate: "2024-03-12",
    stage: "Verbal Commitment",
    assignedRep: "Chris Anderson",
    priority: "High",
    tags: "Security, Audit, Banking",
    createdOn: "2024-02-03T09:30:00Z",
    modifiedOn: "2024-02-08T14:15:00Z"
  },
  {
    Id: 10,
    dealName: "Training Program Development",
    company: "EduTech Solutions",
    dealValue: 50000,
    probability: 65,
    expectedCloseDate: "2024-04-05",
    stage: "Qualification",
    assignedRep: "Monica Singh",
    priority: "Medium",
    tags: "Training, Education, Development",
    createdOn: "2024-02-05T15:45:00Z",
    modifiedOn: "2024-02-10T11:50:00Z"
  },
  {
    Id: 11,
    dealName: "IoT Platform Implementation",
    company: "SmartDevice Inc",
    dealValue: 150000,
    probability: 50,
    expectedCloseDate: "2024-04-30",
    stage: "Proposal",
    assignedRep: "Kevin Park",
    priority: "High",
    tags: "IoT, Platform, Smart",
    createdOn: "2024-02-07T12:20:00Z",
    modifiedOn: "2024-02-12T16:35:00Z"
  },
  {
    Id: 12,
    dealName: "Data Backup Solution",
    company: "Reliable Systems",
    dealValue: 40000,
    probability: 90,
    expectedCloseDate: "2024-03-28",
    stage: "Closed Won",
    assignedRep: "Taylor Brooks",
    priority: "Medium",
    tags: "Backup, Data, Reliable",
    createdOn: "2024-02-08T08:15:00Z",
    modifiedOn: "2024-02-14T10:45:00Z"
  },
  {
    Id: 13,
    dealName: "E-commerce Platform",
    company: "OnlineRetail Pro",
    dealValue: 95000,
    probability: 45,
    expectedCloseDate: "2024-04-12",
    stage: "Discovery",
    assignedRep: "Ashley Davis",
    priority: "Medium",
    tags: "E-commerce, Retail, Platform",
    createdOn: "2024-02-10T14:30:00Z",
    modifiedOn: "2024-02-15T13:20:00Z"
  },
  {
    Id: 14,
    dealName: "Compliance Management System",
    company: "RegTech Innovations",
    dealValue: 220000,
    probability: 35,
    expectedCloseDate: "2024-05-20",
    stage: "Qualification",
    assignedRep: "Jordan Lee",
    priority: "Critical",
    tags: "Compliance, Management, RegTech",
    createdOn: "2024-02-12T11:45:00Z",
    modifiedOn: "2024-02-17T09:10:00Z"
  },
  {
    Id: 15,
    dealName: "Customer Support Portal",
    company: "ServiceFirst Ltd",
    dealValue: 60000,
    probability: 75,
    expectedCloseDate: "2024-03-30",
    stage: "Negotiation",
    assignedRep: "Riley Cohen",
    priority: "Medium",
    tags: "Support, Portal, Customer",
    createdOn: "2024-02-14T16:00:00Z",
    modifiedOn: "2024-02-18T12:25:00Z"
  }
];

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealsService = {
  async getAll() {
    await delay(300);
    try {
      // Return copies to prevent direct mutation
      return mockDeals.map(deal => ({...deal}));
    } catch (error) {
      console.error("Error fetching deals:", error);
      return [];
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const deal = mockDeals.find(d => d.Id === parseInt(id));
      if (!deal) {
        throw new Error("Deal not found");
      }
      return {...deal};
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error);
      throw error;
    }
  },

  async create(dealData) {
    await delay(400);
    try {
      const newDeal = {
        Id: Math.max(...mockDeals.map(d => d.Id)) + 1,
        dealName: dealData.dealName || '',
        company: dealData.company || '',
        dealValue: dealData.dealValue || 0,
        probability: dealData.probability || 0,
        expectedCloseDate: dealData.expectedCloseDate || '',
        stage: dealData.stage || '',
        assignedRep: dealData.assignedRep || '',
        priority: dealData.priority || 'Medium',
        tags: dealData.tags || '',
        createdOn: new Date().toISOString(),
        modifiedOn: new Date().toISOString()
      };
      
      mockDeals.push(newDeal);
      return {...newDeal};
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  },

  async update(id, dealData) {
    await delay(350);
    try {
      const index = mockDeals.findIndex(d => d.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Deal not found");
      }

      const updatedDeal = {
        ...mockDeals[index],
        dealName: dealData.dealName || mockDeals[index].dealName,
        company: dealData.company || mockDeals[index].company,
        dealValue: dealData.dealValue !== undefined ? dealData.dealValue : mockDeals[index].dealValue,
        probability: dealData.probability !== undefined ? dealData.probability : mockDeals[index].probability,
        expectedCloseDate: dealData.expectedCloseDate || mockDeals[index].expectedCloseDate,
        stage: dealData.stage || mockDeals[index].stage,
        assignedRep: dealData.assignedRep || mockDeals[index].assignedRep,
        priority: dealData.priority || mockDeals[index].priority,
        tags: dealData.tags !== undefined ? dealData.tags : mockDeals[index].tags,
        modifiedOn: new Date().toISOString()
      };

      mockDeals[index] = updatedDeal;
      return {...updatedDeal};
    } catch (error) {
      console.error("Error updating deal:", error);
      throw error;
    }
  },

  async delete(id) {
    await delay(300);
    try {
      const index = mockDeals.findIndex(d => d.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Deal not found");
      }

      mockDeals.splice(index, 1);
      return { success: true };
    } catch (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }
  }
};