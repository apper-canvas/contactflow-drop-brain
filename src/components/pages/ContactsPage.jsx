import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contactsService } from "@/services/api/contactsService";
import { companiesService } from "@/services/api/companiesService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ContactCard from "@/components/molecules/ContactCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import ContactForm from "@/components/organisms/ContactForm";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [contactsData, companiesData] = await Promise.all([
        contactsService.getAll(),
        companiesService.getAll()
      ]);
      
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const company = companies.find(c => c.Id === contact.companyId);
    const companyName = company ? company.name.toLowerCase() : "";
    
    return (
      fullName.includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.phone?.includes(searchTerm) ||
      contact.title?.toLowerCase().includes(searchLower) ||
      companyName.includes(searchLower)
    );
  });

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      try {
        await contactsService.delete(contact.Id);
        setContacts(prev => prev.filter(c => c.Id !== contact.Id));
        toast.success("Contact deleted successfully!");
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        const updated = await contactsService.update(selectedContact.Id, contactData);
        setContacts(prev => prev.map(c => c.Id === selectedContact.Id ? updated : c));
      } else {
        const created = await contactsService.create(contactData);
        setContacts(prev => [...prev, created]);
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      throw error;
    }
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const handlePhoneClick = (phone) => {
    window.open(`tel:${phone}`, "_blank");
  };

  const exportContacts = () => {
    const csvData = contacts.map(contact => {
      const company = companies.find(c => c.Id === contact.companyId);
      return {
        "First Name": contact.firstName,
        "Last Name": contact.lastName,
        "Email": contact.email || "",
        "Phone": contact.phone || "",
        "Company": company ? company.name : "",
        "Title": contact.title || "",
        "Notes": contact.notes || ""
      };
    });

    const csv = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
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
            Contacts
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your business contacts and relationships
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={exportContacts}
            disabled={contacts.length === 0}
            className="shadow-sm"
          >
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          
<Button
            variant="secondary"
            onClick={handleAddContact}
            className="shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Contact
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
          placeholder="Search contacts by name, email, phone, or company..."
          className="flex-1 max-w-md"
        />
        
        <div className="flex items-center space-x-6 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Users" className="w-4 h-4" />
            <span>
              {filteredContacts.length} of {contacts.length} contacts
            </span>
          </div>
          
{searchTerm && (
            <button
              className="text-secondary-600 hover:text-secondary-800 font-medium"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </button>
          )}
        </div>
      </motion.div>

      {/* Contacts Grid */}
      <AnimatePresence mode="wait">
        {filteredContacts.length === 0 ? (
          <Empty
            key="empty"
            title={searchTerm ? "No contacts found" : "No contacts yet"}
            message={
              searchTerm 
                ? "Try adjusting your search terms or add a new contact."
                : "Start building your contact database by adding your first contact."
            }
            actionLabel="Add First Contact"
            onAction={handleAddContact}
            icon="UserPlus"
          />
        ) : (
          <motion.div
            key="contacts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
{filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ContactCard
                  contact={contact}
                  company={companies.find(c => c.Id === contact.companyId)}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  onEmailClick={handleEmailClick}
                  onPhoneClick={handlePhoneClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <ContactForm
        contact={selectedContact}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveContact}
      />
    </div>
  );
};

export default ContactsPage;