import { Box } from "@mui/material";
import { Navigation, Pagination } from "swiper/modules"; // Corrected import path
import { Swiper, SwiperSlide } from "swiper/react"; // Ensure SwiperSlide is imported if needed

// Include the required styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NavigationSwiper = ({ children }) => {
  return (
    <Box
      sx={{
        "& .swiper-slide": {
          width: "100%",
          opacity: "0.6",
          paddingBottom: "3rem",
        },
        "& .swiper-slide-active": { opacity: 1 },
        "& .swiper-pagination-bullet": {
          backgroundColor: "text.primary",
        },
        "& .swiper-button-next, & .swiper-button-prev": {
          color: "text.primary",
          "&::after": {
            fontSize: { xs: "1rem", md: "2rem" },
          },
        },
        "& .swiper": {
          paddingX: { xs: "1rem", md: "4rem" },
        },
      }}
    >
      <Swiper
        spaceBetween={10}
        grabCursor={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Navigation, Pagination]}
        style={{ width: "100%", height: "max-content" }}
      >
        {children}
      </Swiper>
    </Box>
  );
};

export default NavigationSwiper;
