import React from 'react'
import Hero from '@/components/sections/hero';
import Services from '@/components/sections/services';
import SelectedProjects from '@/components/sections/selected-projects';

const Page = async () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      {/* Services Section */}
      <Services />
      {/* Selected Projects Section */}
      <SelectedProjects />
    </div>
  )
}

export default Page
