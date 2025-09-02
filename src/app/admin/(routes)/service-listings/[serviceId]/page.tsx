import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import ServiceForm from "@/components/forms/service";

const Page = async (props: {
  params: Promise<{
	serviceId: string;
  }>;
}) => {
  const params = await props.params;
  const initialData = await db.service.findUnique({
	where: {
	  id: params.serviceId,
	},
	include: {
	  materials: {
        include: {
          supplier: true,
        },
      },
	},
  });

  const materials = await db.material.findMany({
	orderBy: {
	  name: "asc",
	},
  });

  return (
	<div>
	  <Heading
		title={!initialData ? "Create new service" : "Edit service"}
		description={
		  !initialData
			? "Fill in the details below to create a new service."
			: "Update the details below to edit this service."
		}
	  />
	  <div className="mt-5">
		<ServiceForm initialData={initialData} materials={materials} />
	  </div>
	</div>
  );
};

export default Page;
