import React from "react";
import ServiceDetails from "@/components/globals/service-details";
import db from "@/lib/db";

const Page = async (props: {
  params: Promise<{
    serviceId: string;
  }>;
}) => {
  const params = await props.params;
  const data = await db.service.findUnique({
    where: {
      id: params.serviceId,
    },
  });
  return (
    <div className="p-10 px-20 mt-20 mb-20 min-h-screen">
      <ServiceDetails data={data} />
    </div>
  );
};

export default Page;
