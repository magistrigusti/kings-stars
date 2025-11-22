'use client';
import { useState, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import s from './Hero.module.scss';

const classesImages = [
  {
    src: '/images/classes/classes-00.png',
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

export default function Hero() {
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
    <section className={s.hero}>
      <div className={s.container}>
        {/* Фото слева - только на десктопе */}
        <div className={s.photoBlock}>
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
                    className={s.photoImage}
                    priority={image.id === 0}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Навигация для фото слайдера */}
          <div className={s.photoControls}>
            <button 
              onClick={handlePrev}
              className={s.photoBtn}
              aria-label="Предыдущее фото"
            >
              ←
            </button>
            
            <div className={s.photoIndicators}>
              {classesImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`${s.photoIndicator} ${
                    index === currentIndex ? s.photoIndicatorActive : ''
                  }`}
                  aria-label={`Фото ${index + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className={s.photoBtn}
              aria-label="Следующее фото"
            >
              →
            </button>
          </div>
        </div>

        {/* Контент по центру - заголовок */}
        <div className={s.content}>
          <h1 className={s.title}>
            открываем таланты,<br />
            <span className={s.titleAccent}>воспитываем </span>
            <span className={s.titleAccent}> личности</span>
          </h1>

          <div className={s.decorLines}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        {/* Видео справа */}
        <div className={s.imageWrapper}>
          <div className={s.circleBlue}></div>
          <div className={s.lineOrange}></div>
          
          <video
            className={s.image}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/video/video_2025-10-24_19-53-43.mp4" type="video/mp4" />
            Ваш браузер не поддерживает видео
          </video>
          
          <div className={s.circleGreen}></div>
        </div>
      </div>

      {/* Фото слайдер под видео - только на мобилке/планшете */}
      <div className={s.mobilePhotoSection}>
        <div 
          className={s.mobileSliderTrack}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={s.mobileSliderInner}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {classesImages.map((image) => (
              <div key={image.id} className={s.mobileSlide}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={800}
                  className={s.mobilePhotoImage}
                  priority={image.id === 0}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={s.mobileControls}>
          <button 
            onClick={handlePrev}
            className={s.mobileControlBtn}
            aria-label="Предыдущее фото"
          >
            ←
          </button>
          
          <div className={s.mobileIndicators}>
            {classesImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`${s.mobileIndicator} ${
                  index === currentIndex ? s.mobileIndicatorActive : ''
                }`}
                aria-label={`Фото ${index + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className={s.mobileControlBtn}
            aria-label="Следующее фото"
          >
            →
          </button>
        </div>
      </div>

      <div className={s.decorBanner}>
        <div className={s.decorCircle}></div>
        <p className={s.bannerText}>
        ★ частный детский сад по методу Монтессори
        </p>
      </div>
    </section>
  );
}
