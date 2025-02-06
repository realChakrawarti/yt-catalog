// Reference: https://shadcn-ui-blocks.vercel.app/blocks/hero-sections

import Link from "next/link";

import { Button } from "../shared/ui/button";

function GlobeBackground() {
  return (
    <video
      disablePictureInPicture
      muted
      autoPlay
      loop
      playsInline
      preload="metadata"
      controls={false}
      className="mx-auto my-16 absolute inset-0 size-auto dark:mix-blend-plus-lighter mix-blend-exclusion aspect-square dark:opacity-60"
    >
      <source src="background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default function HeroSection() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden py-24 lg:py-32">
        {/* Background Video */}
        <GlobeBackground />
        {/* End Background Video */}
        <div className="relative z-10">
          <div className="container py-16 lg:py-20 pb-0">
            <div className="max-w-2xl text-center mx-auto">
              <p className="">Simplify Your YouTube</p>
              {/* Title */}
              <div className="mt-5 max-w-2xl">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Organize Your YouTube Universe
                </h1>
              </div>
              {/* End Title */}
              <div className="mt-5 max-w-3xl">
                <p className="text-xl text-muted-foreground">
                  Tired of endless scrolling? Organize your favorite channels
                  into personalized catalogs. Stay focused, watch what matters.
                </p>
              </div>
              {/* Buttons */}
              <div className="mt-8 gap-3 flex flex-col items-center">
                <Link href="/explore">
                  <Button className="px-4 w-24">Explore</Button>
                </Link>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}
