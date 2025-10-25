import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      className="py-8 text-center text-white"
      style={{ backgroundColor: "#141313" }}
    >
      <p className="font-medium">© {new Date().getFullYear()} Givea. All rights reserved.</p>

      <p className="text-sm mt-2">
        <a href="#privacy" className="hover:underline">Privacy Policy</a>
        <span className="mx-2">|</span>
        <a href="#contact" className="hover:underline">Contact Us</a>
        <span className="mx-2">|</span>
        <a href="#about" className="hover:underline">About</a>
      </p>

      <p className="text-xs mt-3 text-white">
        Made with ❤️ in Morocco by the Givea team
      </p>
    </footer>
  );
};

export default Footer;
