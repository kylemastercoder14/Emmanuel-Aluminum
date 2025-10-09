import React from "react";

const Page = () => {
  return (
    <div className="flex items-center justify-center py-20 flex-col min-h-screen">
      <h3 className="text-3xl font-bold mt-10">Service Guidelines</h3>
      <p className="text-muted-foreground mt-2">
        Date Updated: October 10, 2025
      </p>
      <div className="max-w-7xl mx-auto mt-10 space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-3">Installation Work</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Emmanuel Aluminum Fabrication</strong> takes pride in
            providing efficient and well-coordinated installation services. All
            installation schedules are arranged in advance to ensure smooth
            workflow and minimal disruptions for the customer. Clear
            communication between both parties is essential to guarantee
            successful completion of every project.
          </p>

          <p className="text-gray-700 leading-relaxed mt-3">
            Before installation begins, it is the customer’s responsibility to
            ensure that the work area is:
          </p>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>Accessible to our installation team and equipment.</li>
            <li>
              Cleared of any obstructions, debris, or hazardous materials.
            </li>
            <li>
              Ready for immediate setup, with proper measurements and site
              preparations completed.
            </li>
            <li>Safe for our staff to perform fabrication or assembly work.</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-3">
            Any delays caused by site unavailability, incomplete preparations,
            or restricted access will not be the company’s liability. Customers
            may request a rescheduling of installation, subject to team
            availability and material readiness.
          </p>

          <p className="text-gray-700 leading-relaxed mt-3">
            Rush or priority installation requests may be accommodated depending
            on material stock, manpower, and urgency. However, such requests may
            incur additional costs due to overtime work, transport, or
            procurement of special materials.
          </p>

          <p className="text-gray-700 leading-relaxed mt-3">
            During installation, customers are encouraged to be present or
            represented by an authorized person to oversee progress, clarify
            on-site concerns, and ensure satisfaction with the ongoing work.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Product Warranty</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Emmanuel Aluminum Fabrication</strong> provides a
            comprehensive one-year warranty covering defects in materials and
            workmanship under normal usage conditions. This warranty ensures
            that our products meet quality standards and function as intended.
          </p>

          <h3 className="text-lg font-semibold mt-4">
            Warranty Coverage Includes:
          </h3>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>
              Manufacturing defects in aluminum, tempered glass, and
              accessories.
            </li>
            <li>
              Improper assembly or installation caused by our technicians.
            </li>
            <li>
              Loose hardware fittings or material failures under normal use.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">Warranty Exclusions:</h3>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>
              Damage caused by misuse, accidents, or unauthorized modifications.
            </li>
            <li>
              Wear and tear from daily use or exposure to extreme environmental
              conditions.
            </li>
            <li>
              Corrosion, fading, or discoloration due to improper cleaning
              methods.
            </li>
            <li>
              Scratches, cracks, or breakage resulting from impact or
              mishandling.
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-3">
            The warranty is valid only if products are used and maintained
            according to provided guidelines. Customers are advised to use mild
            cleaning agents and soft materials when cleaning aluminum or
            tempered glass products.
          </p>

          <p className="text-gray-700 leading-relaxed mt-3">
            Repairs or replacements beyond the warranty period will be charged
            according to standard service rates. Customers are encouraged to
            report any issues immediately and allow inspection before repair
            work begins.
          </p>

          <p className="text-gray-700 leading-relaxed mt-3">
            Upon project completion, customers must carefully inspect all work
            and provide formal sign-off acknowledging satisfactory completion
            and acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Hardware Fittings</h2>
          <p className="text-gray-700 leading-relaxed">
            All aluminum products, tempered glass installations, and hardware
            fittings provided by <strong>Emmanuel Aluminum Fabrication</strong>{" "}
            are crafted and installed based on approved customer designs and
            precise measurements. We ensure that every component meets industry
            standards for durability, safety, and aesthetics.
          </p>

          <h3 className="text-lg font-semibold mt-4">
            Customer Responsibilities:
          </h3>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>
              Provide accurate measurements and approved design drawings before
              production begins.
            </li>
            <li>
              Review and confirm all material selections and hardware options
              prior to fabrication.
            </li>
            <li>
              Notify the company immediately of any design or dimension changes.
            </li>
            <li>
              Settle payments according to agreed terms to avoid production or
              delivery delays.
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-3">
            Any modifications requested after approval may result in additional
            costs or adjusted delivery timelines. Our production team will
            communicate all revisions transparently to ensure mutual agreement
            before proceeding.
          </p>

          <h3 className="text-lg font-semibold mt-4">
            Quality and Confidentiality:
          </h3>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>
              All hardware and fittings undergo inspection before installation
              to ensure proper function and finish.
            </li>
            <li>
              Only trusted suppliers and materials are used to guarantee
              long-term reliability.
            </li>
            <li>
              Customer designs, specifications, and project details are treated
              with strict confidentiality.
            </li>
            <li>
              Official receipts and documentation will serve as proof of
              transaction and service coverage.
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-3">
            By engaging with <strong>Emmanuel Aluminum Fabrication</strong>,
            customers acknowledge their role in maintaining clear communication,
            accuracy, and timely cooperation throughout the process to achieve
            successful outcomes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Page;
