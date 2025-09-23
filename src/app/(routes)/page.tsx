import React from 'react'
import Hero from '@/components/sections/hero';
import Services from '@/components/sections/services';
import SelectedProjects from '@/components/sections/selected-projects';
import Quotation from '@/components/globals/quotation';

const Page = async () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      {/* Services Section */}
      <Services />
      {/* Selected Projects Section */}
      <SelectedProjects />
      {/* Quotation Section */}
      <Quotation />
    </div>
  )
}

export default Page
