import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import SupplierForm from "@/components/forms/supplier";

const Page = async (props: {
  params: Promise<{
    supplierId: string;
  }>;
}) => {
  const params = await props.params;
  const initialData = await db.supplier.findUnique({
    where: {
      id: params.supplierId,
    },
  });

  return (
    <div>
      <Heading
        title={!initialData ? "Create new supplier" : "Edit supplier"}
        description={
          !initialData
            ? "Fill in the details below to create a new supplier."
            : "Update the details below to edit this supplier."
        }
      />
      <div className="mt-5">
        <SupplierForm initialData={initialData} />
      </div>
    </div>
  );
};

export default Page;
