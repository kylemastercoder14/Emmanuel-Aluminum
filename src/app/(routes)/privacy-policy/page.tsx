
import React from "react";

const Page = () => {
  return (
    <div className="flex items-center justify-center py-20 flex-col min-h-screen">
      <h3 className="text-3xl font-bold mt-10">Privacy Policy</h3>
      <p className="text-muted-foreground mt-2">
        Date Updated: October 10, 2025
      </p>
      <div className="max-w-7xl mx-auto lg:px-0 px-8 mt-10 space-y-6">
        <p>
          At <strong>Emmanuel Aluminum Fabrication</strong>, we value your trust
          and are committed to protecting your personal information. This
          Privacy Policy explains how we collect, use, store, and protect the
          information you provide when availing of our fabrication,
          installation, and related services, both online and offline.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          1. Information We Collect
        </h2>
        <p>
          We collect information to efficiently process orders, communicate with
          customers, and improve our services. This includes:
        </p>
        <ul className="list-disc ml-6">
          <li>
            <strong>Personal Information:</strong> Name, address, contact
            number, and email address.
          </li>
          <li>
            <strong>Project Details:</strong> Design plans, measurements,
            specifications, and related media (photos or drawings).
          </li>
          <li>
            <strong>Transaction Information:</strong> Invoices, official
            receipts, and payment records.
          </li>
          <li>
            <strong>System Data:</strong> When using our website or system, we
            may collect your account credentials, form inputs, and activity logs
            for security and performance purposes.
          </li>
          <li>
            <strong>Cookies (if applicable):</strong> Small text files that help
            improve site functionality and user experience.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">
          2. How We Use Your Information
        </h2>
        <p>
          The information collected is used strictly for business operations and
          service improvement. Specifically, we use your data to:
        </p>
        <ul className="list-disc ml-6">
          <li>
            Process orders, fabrication requests, and installation scheduling.
          </li>
          <li>
            Communicate project updates, delivery times, and support inquiries.
          </li>
          <li>
            Provide warranty coverage, maintenance, or product replacements.
          </li>
          <li>
            Maintain financial and tax records in compliance with government
            regulations.
          </li>
          <li>
            Enhance our services, website usability, and customer experience.
          </li>
          <li>
            Notify you of updates, promotions, or policy changes (with your
            consent).
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">
          3. Data Protection and Security
        </h2>
        <p>
          We implement strict administrative, technical, and physical safeguards
          to protect your data from unauthorized access, alteration, loss, or
          misuse. Access to customer information is restricted to authorized
          personnel only, and all employees are bound by confidentiality
          obligations.
        </p>
        <p>
          Our website and internal systems are protected with secure connections
          and password-encrypted databases. We also regularly review and update
          our security measures to ensure compliance with applicable privacy
          laws.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          4. Information Sharing and Disclosure
        </h2>
        <p>
          Emmanuel Aluminum Fabrication does not sell, rent, or lease any
          personal information to third parties. However, we may share limited
          information with:
        </p>
        <ul className="list-disc ml-6">
          <li>
            <strong>Authorized Contractors or Partners</strong> – For
            fabrication, delivery, or installation purposes, under strict
            confidentiality agreements.
          </li>
          <li>
            <strong>Government Authorities</strong> – When required by law,
            regulation, or legal process (e.g., tax, audit, or business
            compliance).
          </li>
          <li>
            <strong>Payment Processors</strong> – For processing secure online
            or offline payments, in compliance with financial data protection
            standards.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">5. Data Retention</h2>
        <p>
          Customer information is retained only for as long as necessary to
          fulfill the purpose for which it was collected, or as required by law.
          Once data is no longer needed, it will be securely deleted,
          anonymized, or archived.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          6. Your Rights and Choices
        </h2>
        <p>You have the right to:</p>
        <ul className="list-disc ml-6">
          <li>Access and review the personal information we hold about you.</li>
          <li>Request corrections or updates to inaccurate data.</li>
          <li>
            Withdraw consent for data processing, subject to contractual or
            legal requirements.
          </li>
          <li>Request deletion of your information, where applicable.</li>
        </ul>
        <p>
          Requests may be submitted through our official contact channels listed
          below, and we will respond in accordance with applicable privacy laws.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          7. Use of Cookies (for Online Systems)
        </h2>
        <p>
          Our online system or website may use cookies to enhance user
          experience, remember preferences, and improve functionality. You can
          disable cookies in your browser settings; however, doing so may limit
          certain features of the website.
        </p>

        <h2 className="text-xl font-semibold mt-4">8. Policy Updates</h2>
        <p>
          This Privacy Policy may be updated periodically to reflect
          operational, technical, or legal changes. The latest version will
          always be posted on our website or made available through official
          communication.
        </p>

        <h2 className="text-xl font-semibold mt-4">9. Contact Us</h2>
        <p>
          For inquiries, requests, or concerns regarding this Privacy Policy or
          your personal information, please contact us:
        </p>
        <div className="ml-4">
          <p>
            <strong>Emmanuel Aluminum Fabrication</strong>
          </p>
          <p>📞 +63 912-345-6789</p>
          <p>📧 emmanuelfabrication@gmail.com</p>
          <p>🏢 Victoria Reyes, Dasmarinas City Cavite - 4114, Philippines</p>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          By availing of our services or using our system, you acknowledge that
          you have read, understood, and agreed to the terms of this Privacy
          Policy.
        </p>
      </div>
    </div>
  );
};

export default Page;
