
import Image from 'next/image';

const features = [
  {
    category: "Our History",
    title: "Your space deserves nothing less",
    details:
      "A family-run business located in Barangay Victoria Reyes, Dasmariñas City, Cavite, was established in 2014. With years of experience and dedication, we specialize in crafting-high quality customized aluminum windows, tempered glass, cabinets, and doors designed to meet the unique needs of every client. What started as a small family operation has grown into a trusted name in fabrication, now supported by a skilled team of five hardworking professionals. At Emmanuel Aluminum Fabrication, we take pride in our craftsmanship, attention to detail, and commitment to delivering durable, stylish, and functional designs that enhance both homes and businesses. Our mission is simple to provide reliable, customized solutions that combine modern design with long lasting quality because your space deserves nothing less.",
    tutorialLink: "#",
  },
];

const Features06Page = () => {
  return (
    <div className="min-h-screen lg:px-0 px-6 flex items-center justify-center py-16">
      <div className="max-w-7xl w-full py-10">
        <h2 className="text-4xl md:text-[2.75rem] md:leading-[1.2] font-semibold tracking-[-0.03em] sm:max-w-xl text-pretty sm:mx-auto sm:text-center">
          Know more about us
        </h2>
        <p className="mt-2 text-muted-foreground text-lg sm:text-xl sm:text-center">
          At Emmanuel Fabrication Services, we specialize in high-quality
          aluminum fabrication tailored to your needs.
        </p>
        <div className="mt-8 md:mt-16 w-full mx-auto space-y-20">
          {features.map((feature) => (
            <div
              key={feature.category}
              className="flex flex-col md:flex-row items-center gap-x-12 gap-y-6 md:even:flex-row-reverse"
            >
              <div className="w-full aspect-[4/3] bg-muted rounded-xl border border-border/50 basis-1/2 relative">
			  <Image src="/hero.jpg" alt='About' fill /></div>
              <div className="basis-1/2 shrink-0">
                <span className="uppercase font-medium text-sm text-muted-foreground">
                  {feature.category}
                </span>
                <h4 className="my-3 text-2xl font-semibold tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground">{feature.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features06Page;
