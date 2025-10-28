import React from "react";

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p>Need help? Contact us at <a href="mailto:support@givea.com" className="text-blue-500">support@givea.com</a></p>
    </div>
  );
};

export default ContactUs;
