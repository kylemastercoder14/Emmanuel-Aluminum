import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import UserForm from "@/components/forms/user";

const Page = async (props: {
  params: Promise<{
	userId: string;
  }>;
}) => {
  const params = await props.params;
  const initialData = await db.staff.findUnique({
	where: {
	  id: params.userId,
	},
  });

  return (
	<div>
	  <Heading
		title={!initialData ? "Create new user" : "Edit user"}
		description={
		  !initialData
			? "Fill in the details below to create a new user."
			: "Update the details below to edit this user."
		}
	  />
	  <div className="mt-5">
		<UserForm initialData={initialData} />
	  </div>
	</div>
  );
};

export default Page;
