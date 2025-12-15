import React from "react";
import {
  FaInstagram,
} from "react-icons/fa";
import { FaLinkedin, FaSquareFacebook, FaSquareXTwitter } from "react-icons/fa6";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="b-g-surface pt-14">
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Logo + Intro */}
          <div className="flex flex-col items-start md:items-start">
          <div className="mb-4">
            {/* Replace with your logo */}
            <img src={logo} alt="LocalChefBazaar Logo" className="h-10" />
          </div>
          <p className="t-muted max-w-xs text-sm">
            Chef Hut brings fresh, home-cooked meals from expert chefs straight to your doorstep.
          </p>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="t-primary font-semibold mb-4">Contact</h4>
          <p className="t-muted text-sm mb-2">📍Mirpur, Dhaka, Bangladesh</p>
          <p className="t-muted text-sm mb-2">📧 support@chefhut.com</p>
          <p className="t-muted text-sm">📞 +880 1234-567890</p>
        </div>

        {/* Working Hours */}
        <div>
          <h4 className="t-primary font-semibold mb-4">Working Hours</h4>
          <p className="t-muted text-sm mb-2">Sat – Thu: 10:00 AM – 10:00 PM</p>
          <p className="t-muted text-sm">Friday: Closed</p>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="t-primary font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/" className="t-muted hover-accent transition"><FaSquareFacebook /></a>
            <a href="https://www.instagram.com/" className="t-muted hover-accent transition"><FaInstagram /></a>
            <a href="https://www.x.com/" className="t-muted hover-accent transition"><FaSquareXTwitter/></a>
            <a href="https://www.linkedin.com/" className="t-muted hover-accent transition"><FaLinkedin/></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-[#23232A] py-6 text-center">
        <p className="t-muted text-sm">
          © {new Date().getFullYear()} Moon Ahmed. All rights reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
