import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer
      className="py-8 text-center text-white"
      style={{ backgroundColor: "#141313" }}
    >
      <p className="font-medium">
        © {new Date().getFullYear()} Givea. All rights reserved.
      </p>

      <p className="text-sm mt-2">
        <Link to="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <span className="mx-2">|</span>
        <Link to="/contact" className="hover:underline">
          Contact Us
        </Link>
        <span className="mx-2">|</span>
        <Link to="/about" className="hover:underline">
          About
        </Link>
      </p>

      <p className="text-xs mt-3 text-white">
        Made with ❤️ in Morocco by the Givea team
      </p>
    </footer>
  );
};

export default Footer;
