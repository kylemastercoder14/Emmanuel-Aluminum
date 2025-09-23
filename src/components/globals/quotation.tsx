import React from "react";
import QuotationForm from "@/components/forms/quotation";

const Quotation = () => {
  return (
    <div className="flex flex-col max-w-full mx-auto w-full items-center justify-center pb-20">
      <h2 className="text-center font-bold text-4xl mb-10 tracking-tight">
        Need help? Get a quote.
      </h2>
      <QuotationForm />
    </div>
  );
};

export default Quotation;
