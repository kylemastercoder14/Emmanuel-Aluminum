/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { redirect } from "next/navigation";
import { useAdmin } from "@/hooks/use-admin";
import StaffAccountForm from "@/components/forms/staff-account";

const Page = async () => {
  const { staff } = await useAdmin();

  if (!staff) {
    redirect("/admin");
  }

  return <StaffAccountForm staff={staff} />;
};

export default Page;
