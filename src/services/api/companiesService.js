import companiesData from "@/services/mockData/companies.json";

let companies = [...companiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const companiesService = {
  async getAll() {
    await delay(350);
    return [...companies];
  },

  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error("Company not found");
    }
    return { ...company };
  },

  async create(companyData) {
    await delay(450);
    
    const newCompany = {
      Id: Math.max(0, ...companies.map(c => c.Id)) + 1,
      ...companyData,
      contactIds: companyData.contactIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    companies.push(newCompany);
    return { ...newCompany };
  },

  async update(id, companyData) {
    await delay(450);
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    
    const updatedCompany = {
      ...companies[index],
      ...companyData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    companies[index] = updatedCompany;
    return { ...updatedCompany };
  },

  async delete(id) {
    await delay(300);
    
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    
    companies.splice(index, 1);
    return { success: true };
  }
};