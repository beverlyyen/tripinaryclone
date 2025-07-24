import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation"; // import styles for arrows

import Activity_Card from "../activity_card/activity_card";

import "./activity_carousel.css";

function Activity_Carousel({ category, list }) {
  console.log({ category: category, pois: list });

  return (
    <div className="carousel-container">
      <h1>{category}</h1>
      <div className="carousel-wrapper">
        <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          slidesPerView={4}
          navigation
          loop
          className="carousel"
        >
          {list.map((attr, i) => (
            <SwiperSlide key={i}>
              <div className="activity_card_container">
                <Activity_Card
                  img={`${attr.name}.png`}
                  title={attr.name}
                  desc={attr.description}
                  rating={attr.rating}
                  price_level={attr.price_level}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Activity_Carousel;
