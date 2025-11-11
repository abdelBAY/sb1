import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="py-8 text-center text-white"
      style={{ backgroundColor: "#141313" }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-medium"
      >
        © {new Date().getFullYear()} Givea. All rights reserved.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm mt-2"
      >
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
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xs mt-3 text-white"
      >
        Made with ❤️ in Morocco by the Givea team
      </motion.p>
    </motion.footer>
  );
};

export default Footer;
