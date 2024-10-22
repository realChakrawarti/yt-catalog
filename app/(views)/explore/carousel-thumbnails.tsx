"use client";

import React from "react";
import Slider, { type Settings } from "react-slick";

function ThumbnailCarousel({ thumbnails }: { thumbnails: string[] }) {
  const settings: Settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 1500,
    cssEase: "linear",
  };


  return (
    <div className="">
      <Slider {...settings}>
        {thumbnails?.map((thumb) => (
          <div key={thumb}>
            <img
              className="object-contain w-80 h-60"
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
