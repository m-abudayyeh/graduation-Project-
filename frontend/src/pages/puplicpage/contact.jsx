import ContactHeader from "./contactComponents/ContactHeader";
import ContactForm from "./contactComponents/ContactForm"
import ContactInfo from "./contactComponents/ContactInfo";
import CompanyLocation from "./contactComponents/CompanyLocation";
const ContactPage = () => {
  return (
    <div className="container bg-[#F5F5F5]">
      <ContactHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 ">
        <ContactForm />
        
        <div>
          <ContactInfo />
          <CompanyLocation />
        </div>
      </div>
    </div>
  );
};
export default ContactPage ;