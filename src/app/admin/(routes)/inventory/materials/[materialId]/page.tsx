import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import MaterialForm from "@/components/forms/material";

const Page = async (props: {
  params: Promise<{
    materialId: string;
  }>;
}) => {
  const params = await props.params;
  const initialData = await db.material.findUnique({
    where: {
      id: params.materialId,
    },
    include: {
      supplier: true,
    },
  });

  const suppliers = await db.supplier.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      status: true
    }
  });

  return (
    <div>
      <Heading
        title={!initialData ? "Create new material" : "Edit material"}
        description={
          !initialData
            ? "Fill in the details below to create a new material."
            : "Update the details below to edit this material."
        }
      />
      <div className="mt-5">
        <MaterialForm initialData={initialData} suppliers={suppliers} />
      </div>
    </div>
  );
};

export default Page;
