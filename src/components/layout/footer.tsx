import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="bg-navbar py-4 text-gray-100">
        <div className="container mx-auto px-4">
          <div className="-mx-4 flex flex-wrap justify-between">
            <div className="px-4 w-full text-center sm:w-auto sm:text-left">
              Copyright © 2025 Emmanuel Aluminum Fabrication. All Rights
              Reserved.
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/service-guidelines"
                className="text-gray-100 hover:underline"
              >
                Service Guidelines
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href="/privacy-policy"
                className="text-gray-100 hover:underline"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href="/terms-of-service"
                className="text-gray-100 hover:underline"
              >
                Terms of Service
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href="/intellectual-property"
                className="text-gray-100 hover:underline"
              >
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
