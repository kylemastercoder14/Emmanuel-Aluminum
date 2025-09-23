import React from "react";
import db from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Page = async (props: {
  params: Promise<{
    quotationId: string;
  }>;
}) => {
  const params = await props.params;
  const quotation = await db.quotation.findUnique({
    where: {
      id: params.quotationId,
    },
  });

  if (!quotation) {
    return <div className="p-6 text-red-500">Quotation not found.</div>;
  }

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>
            Quotation Details{" "}
            <Badge
              variant={
                quotation.status === "APPROVED"
                  ? "success"
                  : quotation.status === "REJECTED"
                  ? "destructive"
                  : "secondary"
              }
			  className='ml-2'
            >
              {quotation.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Name</p>
            <p>
              {quotation.firstName} {quotation.lastName}
            </p>
          </div>
          <div>
            <p className="font-semibold">Contact Number</p>
            <p>{quotation.contactNumber}</p>
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p>{quotation.email}</p>
          </div>
          <div>
            <p className="font-semibold">Service Type</p>
            <p>{quotation.serviceType}</p>
          </div>
          <div>
            <p className="font-semibold">Size</p>
            <p>
              {quotation.size} {quotation.unit}
            </p>
          </div>
          <div>
            <p className="font-semibold">Color / Variant</p>
            <p>
              {quotation.color} {quotation.variants}
            </p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">Description</p>
            <p>{quotation.description}</p>
          </div>
          <div>
            <p className="font-semibold">Preferred Date</p>
            <p>
              {new Date(quotation.preferredDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="font-semibold">Preferred Time</p>
            <p>
              {new Date(quotation.preferredDate).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
          </div>
          {quotation.note && (
            <div className="col-span-2">
              <p className="font-semibold">Note</p>
              <p>{quotation.note}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
