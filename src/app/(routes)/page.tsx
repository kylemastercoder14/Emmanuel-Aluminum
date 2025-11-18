import React from "react";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import SelectedProjects from "@/components/sections/selected-projects";
import Quotation from "@/components/globals/quotation";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      {/* Services Section */}
      {user && <Services />}
      {/* Selected Projects Section */}
      <SelectedProjects />
      {/* Quotation Section */}
      <Quotation />
    </div>
  );
};

export default Page;
