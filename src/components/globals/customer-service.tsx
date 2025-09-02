"use client";

import React from 'react'
import { Button } from '@/components/ui/button';
import { IconMessage } from '@tabler/icons-react';

const CustomerService = () => {
  return (
	<Button type="button" size="icon" className='fixed p-5 bottom-5 right-5 rounded-full'>
	  <IconMessage className='size-6' />
	</Button>
  )
}

export default CustomerService
