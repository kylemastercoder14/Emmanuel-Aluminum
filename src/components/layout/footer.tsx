import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="bg-navbar py-6 text-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            {/* Copyright */}
            <div className="text-center sm:text-left text-sm sm:text-base">
              © 2025 Emmanuel Aluminum Fabrication. All Rights Reserved.
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 text-sm sm:text-base">
              <Link href="/service-guidelines" className="hover:underline">
                Service Guidelines
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link href="/terms-of-service" className="hover:underline">
                Terms of Service
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link href="/intellectual-property" className="hover:underline">
                Intellectual Property
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
