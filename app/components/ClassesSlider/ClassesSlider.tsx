'use client';
import { useState, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import s from './ClassesSlider.module.scss';

const classesImages = [
  {
    src: '/images/classes/about-00.png',
    alt: 'Дети в развивающем центре',
    id: 0
  },
  {
    src: '/images/classes/classes-01.jpg',
    alt: 'Занятия с детьми',
    id: 1
  },
  {
    src: '/images/classes/classes-02.png',
    alt: 'Творческие занятия',
    id: 2
  },
  {
    src: '/images/classes/classes-03.png',
    alt: 'Развивающие игры',
    id: 3
  }
];

export default function ClassesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? classesImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === classesImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePrev();
    }
  };

  return (
    <div className={s.slider}>
      <div 
        className={s.sliderTrack}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={s.sliderInner}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {classesImages.map((image) => (
            <div key={image.id} className={s.slide}>
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={800}
                className={s.image}
                priority={image.id === 0}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={s.controls}>
        <button 
          onClick={handlePrev}
          className={s.controlBtn}
          aria-label="Предыдущее фото"
        >
          ←
        </button>
        
        <div className={s.indicators}>
          {classesImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`${s.indicator} ${
                index === currentIndex ? s.indicatorActive : ''
              }`}
              aria-label={`Фото ${index + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className={s.controlBtn}
          aria-label="Следующее фото"
        >
          →
        </button>
      </div>
    </div>
  );
}