/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Slider, { type Settings } from "react-slick";

function ThumbnailCarousel({ thumbnails }: { thumbnails: string[] }) {
  const settings: Settings = {
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    cssEase: "linear",
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: 1,
  };

  return (
    <div className="size-full overflow-hidden">
      <Slider {...settings}>
        {thumbnails?.map((thumb) => (
          <div key={thumb}>
            <img
              className="object-contain size-full"
              src={thumb}
              alt="thumbnail"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ThumbnailCarousel;
