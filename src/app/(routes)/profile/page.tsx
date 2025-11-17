/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import ProfileClient from "./client";

const Page = async () => {
  const { user } = await useUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <ProfileClient user={user} />;
};

export default Page;
