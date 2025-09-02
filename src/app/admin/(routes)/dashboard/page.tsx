import React from "react";
import StatCard from "./_components/stat-card";
import { ServiceChart } from './_components/service-chart';

const Page = () => {
  return (
    <div>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
        <StatCard
          title="Total Revenue"
          data="₱58,482.94"
          percentage="+12.5%"
          trend="up"
          recommendation="Keep more customers engaged"
          description="Steady profit growth"
        />
		<StatCard
          title="Inventory"
          data="142"
          percentage="-1.2%"
          trend="down"
          recommendation="Consider reducing stock levels"
          description="Declining inventory levels"
        />
		<StatCard
          title="Customer"
          data="24"
          percentage="+4.7%"
          trend="up"
          recommendation="Promote more on social media"
          description="Steady customer growth"
        />
		<StatCard
          title="Project"
          data="12"
          percentage="-0.3%"
          trend="down"
          recommendation="Consider revising project timelines"
          description="Steady project decline"
        />
      </div>
	  <div className="mt-5">
		<ServiceChart />
	  </div>
    </div>
  );
};

export default Page;
