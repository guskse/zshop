import "./Slider.scss";
import { useState, useEffect } from "react";

//Slider Images and Data
import { sliderData } from "./slider.data";

//icons
import { MdOutlineArrowBack, MdOutlineArrowForward } from "react-icons/md";

const Slider = () => {
  //slide state
  const [currentSlide, setCurrentSlide] = useState(0);

  //on first render, set currentSlide to 0
  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  const slideLength = sliderData.length; //4 images inside the sliderData

  //go to next slide
  const nextSlide = () => {
    //if next slide is equal to the slideLength, set currentSlide to 0 again
    //else, add 1 to the currentSlide
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };

  //go to prev slide
  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  // Effect to change slide automatically every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 7000); // Change slide every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentSlide]);

  return (
    <div className="slider">
      <MdOutlineArrowBack
        className="arrow prev"
        onClick={prevSlide}
        size={30}
      />
      <MdOutlineArrowForward
        className="arrow next"
        onClick={nextSlide}
        size={30}
      />
      {sliderData.map((slide, index) => {
        return (
          <div
            key={index}
            className={index === currentSlide ? "slide current" : "slide"}
          >
            {index === currentSlide && (
              <>
                <img src={slide.image} alt={slide.heading} />
                <div className="content">
                  <h2>{slide.heading}</h2>
                  <p>{slide.desc}</p>
                  <hr />
                  <a href="#products" className="--btn-primary" id="slider-button">
                    Shop Now
                  </a>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Slider;
