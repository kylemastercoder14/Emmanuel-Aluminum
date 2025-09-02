import React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from '@/components/layout/footer';
import CustomerService from '@/components/globals/customer-service';

const MainLayout = ({children}: {
  children: React.ReactNode
}) => {
  return (
    <div>
      <Navbar />
      {children}
      {/* Footer Section */}
      <Footer />
      <CustomerService />
    </div>
  );
};

export default MainLayout;
