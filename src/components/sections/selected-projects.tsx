
import React from "react";
import { BentoGrid } from "@/components/globals/bento-grid";

const SelectedProjects = () => {
  return (
    <div className="flex items-center mb-20 pt-10 pb-10 w-full h-screen justify-center flex-col bg-[#2916161e]">
      <div className="flex flex-col items-center justify-center mb-5">
        <h3 className="text-4xl font-bold tracking-tight">
          Our selected projects
        </h3>
        <div className="bg-black w-40 mt-2.5 h-1 rounded-full mx-auto" />
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
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, recusandae.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Jalosy windows
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero non debitis iste praesentium deleniti corrupti.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Sliding window
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam, ullam dolorum numquam in veniam architecto!
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Tempered glass window
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus at ex itaque nobis consequuntur veritatis nulla perferendis et laboriosam pariatur.
      </p>
    </div>
  );
};

const SkeletonFive = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Glass stair railing
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero libero fugit at officia itaque eum.
      </p>
    </div>
  );
};

const SkeletonSix = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Pull-up window glass
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad eaque, quae dolorem officiis quia deleniti quasi nihil maiores blanditiis rem.
      </p>
    </div>
  );
};

const SkeletonSeven = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Church-type window
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe tenetur aspernatur amet sequi omnis ab consequuntur error laudantium excepturi eveniet.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail:
      "/selected-projects/6.jpg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "/selected-projects/4.jpg",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "/selected-projects/3.jpg",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "/selected-projects/5.jpg",
  },
  {
    id: 5,
    content: <SkeletonFive />,
    className: "col-span-1",
    thumbnail:
      "/selected-projects/1.jpg",
  },
  {
    id: 6,
    content: <SkeletonSix />,
    className: "col-span-1",
    thumbnail:
      "/selected-projects/7.jpg",
  },
  {
    id: 7,
    content: <SkeletonSeven />,
    className: "col-span-1",
    thumbnail:
      "/selected-projects/2.jpg",
  },
];
