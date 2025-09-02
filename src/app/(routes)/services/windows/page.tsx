import React from "react";
import db from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {
  const data = await db.service.findMany({
    where: {
      category: "Window",
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="p-10 px-20 mt-20 mb-20 min-h-screen">
      <h3 className="text-2xl font-bold tracking-tight">Window Design</h3>
      <p className="text-muted-foreground">
        Browse all <span className="font-semibold">window design</span>{" "}
        services.
      </p>
      <div className="grid mt-5 lg:grid-cols-4 grid-cols-1 gap-5">
        {data.length > 0 ? (
          data.map((service) => (
            <Link
              href={`/services/windows/${service.id}`}
              key={service.id}
              className="w-full h-[500px]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={service.images[0] || ""}
                  alt={service.name}
                  fill
                  className="size-full object-contain"
                />
              </div>
              <h3 className="font-semibold mt-3 text-lg text-center">
                {service.name}
              </h3>
            </Link>
          ))
        ) : (
          <div className="col-span-4 flex flex-col mt-10 items-center justify-center text-center">
            <Image src="/empty.svg" alt="Empty" width={300} height={300} />
            <p className="mt-5 text-xl font-semibold">
              No window design services found.
            </p>
            <p className="mt-2 text-muted-foreground">
              Please refresh the page, or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
