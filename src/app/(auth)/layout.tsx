import React from 'react'
import Navbar from '@/components/layout/navbar'

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
	<div>
	  <Navbar />
	  {children}
	</div>
  )
}

export default AuthLayout
