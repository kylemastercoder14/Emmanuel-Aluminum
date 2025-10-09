"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Services = () => {
  const router = useRouter();
  return (
    <div id='services' className="mt-10 pb-20 px-30">
      <div className="flex flex-col items-start justify-center">
        <h3 className="text-4xl font-bold tracking-tight">
          Choose our services
        </h3>
        <div className="bg-black w-30 mt-2 h-1 rounded-full" />
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-5 mt-10">
        {/* Windows */}
        <Card className="border">
          <CardContent className="text-[15px] px-5">
            <div className="mb-3 w-full relative aspect-video rounded-xl">
              <Image src="/services/1.jpg" alt='Windows' fill className='size-full object-cover' />
            </div>
            <h3 className='text-xl font-semibold'>Windows</h3>
            <p className='text-muted-foreground'>
              High-quality aluminum and steel windows designed for durability,
              security, and modern aesthetics.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/services/windows")} className="bg-[#642828] hover:bg-[#642828b9] text-white px-6 py-4 font-medium">
              View Details <ArrowRight />
            </Button>
          </CardFooter>
        </Card>

        {/* Doors */}
        <Card className="border">
          <CardContent className="text-[15px] px-5">
            <div className="mb-3 w-full relative aspect-video rounded-xl">
              <Image src="/services/2.jpg" alt='Doors' fill className='size-full object-cover' />
            </div>
            <h3 className='text-xl font-semibold'>Doors</h3>
            <p className='text-muted-foreground'>
              Strong and stylish doors that enhance your home’s look while
              providing long-lasting protection.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/services/doors")} className="bg-[#642828] hover:bg-[#642828b9] text-white px-6 py-4 font-medium">
              View Details <ArrowRight />
            </Button>
          </CardFooter>
        </Card>

        {/* Cabinets */}
        <Card className="border">
          <CardContent className="text-[15px] px-5">
            <div className="mb-3 w-full relative aspect-video rounded-xl">
              <Image src="/services/3.jpg" alt='Cabinets' fill className='size-full object-cover' />
            </div>
            <h3 className='text-xl font-semibold'>Cabinets</h3>
            <p className='text-muted-foreground'>
              Custom-built cabinets crafted for functionality and
              elegance, perfect for any space.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/services/cabinets")} className="bg-[#642828] hover:bg-[#642828b9] text-white px-6 py-4 font-medium">
              View Details <ArrowRight />
            </Button>
          </CardFooter>
        </Card>

        {/* Tempered Glasses */}
        <Card className="border">
          <CardContent className="text-[15px] px-5">
            <div className="mb-3 w-full relative aspect-video rounded-xl">
              <Image src="/services/4.jpg" alt='Tempered Glasses' fill className='size-full object-cover' />
            </div>
            <h3 className='text-xl font-semibold'>Tempered Glasses</h3>
            <p className='text-muted-foreground'>
              Premium tempered glass solutions for windows, doors,
              and partitions, combining safety with style.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/services/tempered-glasses")} className="bg-[#642828] hover:bg-[#642828b9] text-white px-6 py-4 font-medium">
              View Details <ArrowRight />
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
};

export default Services;
