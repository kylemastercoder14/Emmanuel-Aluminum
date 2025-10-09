import React from "react";
import { BentoGrid } from "@/components/globals/bento-grid";

const SelectedProjects = () => {
  return (
    <div className="flex items-center mb-20 pt-10 pb-10 w-full h-screen justify-center flex-col bg-[#2916161e]">
      <div className="flex flex-col items-center justify-center mb-5">
        <h3 className="text-4xl font-bold tracking-tight">
          Our Selected Projects
        </h3>
        <div className="bg-black w-40 mt-2.5 h-1 rounded-full mx-auto" />
        <p className="text-center max-w-2xl mt-4 text-neutral-700">
          Take a closer look at some of our finest aluminum and glass
          fabrication works.
        </p>
      </div>
      <BentoGrid cards={cards} />
    </div>
  );
};

export default SelectedProjects;

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Tempered Cabinet
      </p>
      <p className="font-normal text-base text-white">Modern Glass Display</p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A custom-built tempered glass cabinet designed for both elegance and
        durability. Perfect for showcasing products or home collections, it
        combines sleek aluminum framing with premium clear tempered glass for a
        refined, modern look.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Jalousie Windows
      </p>
      <p className="font-normal text-base text-white">
        Ventilation and Style Combined
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A functional and aesthetic jalousie window installation designed to
        maximize airflow while maintaining privacy. Made with precision-cut
        aluminum frames and durable glass blades, it’s ideal for both
        residential and commercial spaces.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">Sliding Window</p>
      <p className="font-normal text-base text-white">
        Smooth and Space-Saving
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A seamless sliding window system crafted for modern homes. Its smooth
        glide mechanism, weather-sealed edges, and minimalist aluminum frame
        make it an excellent choice for natural lighting and ventilation.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Tempered Glass Window
      </p>
      <p className="font-normal text-base text-white">Strength and Clarity</p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        This project features large tempered glass window panels that enhance
        safety and sophistication. Engineered to withstand impact and
        temperature fluctuations, it provides a panoramic view while maintaining
        structural integrity and elegance.
      </p>
    </div>
  );
};

const SkeletonFive = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Glass Stair Railing
      </p>
      <p className="font-normal text-base text-white">Modern Safety Design</p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A contemporary glass railing installation featuring clear tempered glass
        panels supported by stainless fittings and aluminum framing. It provides
        both safety and a luxurious open-space feel, ideal for modern interiors.
      </p>
    </div>
  );
};

const SkeletonSix = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Pull-Up Window Glass
      </p>
      <p className="font-normal text-base text-white">
        Practical and Elegant Engineering
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A custom pull-up window system designed for flexible ventilation and
        accessibility. Built with high-quality tempered glass and aluminum
        mechanisms to ensure long-lasting performance and effortless operation.
      </p>
    </div>
  );
};

const SkeletonSeven = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Church-Type Window
      </p>
      <p className="font-normal text-base text-white">
        Elegant Architectural Work
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A beautifully designed church-style window project combining artistic
        glasswork with sturdy aluminum frames. Its arched form and intricate
        details bring timeless beauty and spiritual warmth to any structure.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail: "/selected-projects/6.jpg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: "/selected-projects/4.jpg",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: "/selected-projects/3.jpg",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail: "/selected-projects/5.jpg",
  },
  {
    id: 5,
    content: <SkeletonFive />,
    className: "col-span-1",
    thumbnail: "/selected-projects/1.jpg",
  },
  {
    id: 6,
    content: <SkeletonSix />,
    className: "col-span-1",
    thumbnail: "/selected-projects/7.jpg",
  },
  {
    id: 7,
    content: <SkeletonSeven />,
    className: "col-span-1",
    thumbnail: "/selected-projects/2.jpg",
  },
];
