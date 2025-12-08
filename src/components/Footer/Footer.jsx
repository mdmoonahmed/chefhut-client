import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="b-g-main py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Logo and Description */}
        <div className="flex flex-col items-start md:items-start">
          <div className="mb-4">
            <img src={logo} alt="LocalChefBazaar Logo" className="h-10" />
          </div>
          <p className="t-muted max-w-xs text-sm">
            LocalChefBazaar brings fresh, home-cooked meals from expert chefs straight to your doorstep.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col gap-2">
            <h4 className="t-primary font-semibold mb-2">Company</h4>
            <a href="/" className="t-muted hover-accent text-sm">Home</a>
            <a href="/meals" className="t-muted hover-accent text-sm">Meals</a>
            <a href="/about" className="t-muted hover-accent text-sm">About Us</a>
            <a href="/contact" className="t-muted hover-accent text-sm">Contact</a>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="t-primary font-semibold mb-2">Support</h4>
            <a href="/faq" className="t-muted hover-accent text-sm">FAQ</a>
            <a href="/help" className="t-muted hover-accent text-sm">Help Center</a>
            <a href="/terms" className="t-muted hover-accent text-sm">Terms & Conditions</a>
            <a href="/privacy" className="t-muted hover-accent text-sm">Privacy Policy</a>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col gap-4 mt-4 md:mt-0">
          <h4 className="t-primary font-semibold mb-2">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="t-muted hover-accent"><FaFacebookF /></a>
            <a href="#" className="t-muted hover-accent"><FaInstagram /></a>
            <a href="#" className="t-muted hover-accent"><FaTwitter /></a>
            <a href="#" className="t-muted hover-accent"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-[#23232A] pt-6 text-center">
        <p className="t-muted text-sm">
          &copy; {new Date().getFullYear()} LocalChefBazaar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
