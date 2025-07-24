import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation"; // import styles for arrows

import Activity_Card from "../activity_card/activity_card";

import "./activity_carousel.css";

function Activity_Carousel({ category, list }) {

  const getPhotoUrl = (imgSrc, maxWidth) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
    if (!imgSrc) 
      return "default_img.jpg"

    return `https://places.googleapis.com/v1/${imgSrc}/media?key=${API_KEY}&maxWidthPx=${maxWidth}`
  }


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
                  img={attr.photos && attr.photos.length > 0 ?
                    getPhotoUrl(attr.photos[0].name, 300) : "default_img"}
                  title={attr.displayName.text}
                  desc={attr.editorialSummary?.text || attr.generativeSummary?.text || ''}
                  rating={attr.rating}
                  price_level={attr.priceLevel || ''}
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
