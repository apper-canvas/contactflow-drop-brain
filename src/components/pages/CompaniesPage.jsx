import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CompanyCard from "@/components/molecules/CompanyCard";
import CompanyForm from "@/components/organisms/CompanyForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { companiesService } from "@/services/api/companiesService";
import { contactsService } from "@/services/api/contactsService";
import { toast } from "react-toastify";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    loadData();
  }, []);
const { user } = useSelector((state) => state.user);
  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [companiesData, contactsData] = await Promise.all([
        companiesService.getAll(),
        contactsService.getAll()
      ]);
      
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const filteredCompanies = companies.filter(company => {
    const searchLower = searchTerm.toLowerCase();
    
    return (
      (company.name_c || company.name || '').toLowerCase().includes(searchLower) ||
      (company.industry_c || company.industry || '').toLowerCase().includes(searchLower) ||
      (company.description_c || company.description || '').toLowerCase().includes(searchLower) ||
      (company.website_c || company.website || '').toLowerCase().includes(searchLower)
    );
  });
const getContactCount = (companyId) => {
    return contacts.filter(contact => (contact.company_id_c || contact.companyId) === companyId).length;
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

const handleDeleteCompany = async (company) => {
    const contactCount = getContactCount(company.Id);
    const companyName = company.name_c || company.name || '';
    
    let confirmMessage = `Are you sure you want to delete ${companyName}?`;
    if (contactCount > 0) {
      confirmMessage += ` This will also remove the company association from ${contactCount} contact${contactCount !== 1 ? "s" : ""}.`;
    }
    
    if (window.confirm(confirmMessage)) {
      try {
        // Remove company association from contacts
        const companyContacts = contacts.filter(contact => (contact.company_id_c || contact.companyId) === company.Id);
        for (const contact of companyContacts) {
          await contactsService.update(contact.Id, { ...contact, companyId: "" });
        }
        
        // Delete the company
        await companiesService.delete(company.Id);
        
        // Update state
        setCompanies(prev => prev.filter(c => c.Id !== company.Id));
        setContacts(prev => prev.map(contact => 
          (contact.company_id_c || contact.companyId) === company.Id 
            ? { ...contact, companyId: "" }
            : contact
        ));
        
        toast.success("Company deleted successfully!");
      } catch (error) {
        console.error("Error deleting company:", error);
        toast.error("Failed to delete company");
      }
    }
  };

  const handleSaveCompany = async (companyData) => {
    try {
      if (selectedCompany) {
        const updated = await companiesService.update(selectedCompany.Id, companyData);
        setCompanies(prev => prev.map(c => c.Id === selectedCompany.Id ? updated : c));
      } else {
        const created = await companiesService.create(companyData);
        setCompanies(prev => [...prev, created]);
      }
    } catch (error) {
      console.error("Error saving company:", error);
      throw error;
    }
  };

  const handleWebsiteClick = (website) => {
    const url = website.startsWith("http") ? website : `https://${website}`;
    window.open(url, "_blank");
  };

const exportCompanies = () => {
    const csvData = companies.map(company => ({
      "Company Name": company.name_c || company.name || "",
      "Industry": company.industry_c || company.industry || "",
      "Size": (company.size_c || company.size) ? `${company.size_c || company.size} employees` : "",
      "Website": company.website_c || company.website || "",
      "Description": company.description_c || company.description || "",
      "Contact Count": getContactCount(company.Id)
    }));

    const csv = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "companies.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <Loading count={6} />;
  }

  if (error) {
    return <Error error={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-800 bg-clip-text text-transparent">
            Companies
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your business relationships and partnerships
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={exportCompanies}
            disabled={companies.length === 0}
            className="shadow-sm"
          >
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleAddCompany}
            className="shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </div>
      </motion.div>

      {/* Search and Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search companies by name, industry, or description..."
          className="flex-1 max-w-md"
        />
        
        <div className="flex items-center space-x-6 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Building2" className="w-4 h-4" />
            <span>
              {filteredCompanies.length} of {companies.length} companies
            </span>
          </div>
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-secondary-600 hover:text-secondary-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      </motion.div>

      {/* Companies Grid */}
      <AnimatePresence mode="wait">
        {filteredCompanies.length === 0 ? (
          <Empty
            key="empty"
            title={searchTerm ? "No companies found" : "No companies yet"}
            message={
              searchTerm 
                ? "Try adjusting your search terms or add a new company."
                : "Start building your business network by adding your first company."
            }
            actionLabel="Add First Company"
            onAction={handleAddCompany}
            icon="Building2"
          />
        ) : (
          <motion.div
            key="companies"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CompanyCard
                  company={company}
                  contactCount={getContactCount(company.Id)}
                  onEdit={handleEditCompany}
                  onDelete={handleDeleteCompany}
                  onWebsiteClick={handleWebsiteClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Company Form Modal */}
      <CompanyForm
        company={selectedCompany}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveCompany}
      />
    </div>
  );
};

export default CompaniesPage;