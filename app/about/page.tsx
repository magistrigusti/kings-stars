'use client';
import Navigation from '../components/Navigation/Navigation';
import { useState, useRef, TouchEvent } from 'react';
import AboutCard from '../components/AboutCard/AboutCard';
import { aboutData } from './aboutData';
import Image from 'next/image';
import s from './page.module.scss';

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? aboutData.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === aboutData.length - 1 ? 0 : prev + 1
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
    <main className={s.about}>
      <Navigation />
      
      <div className={s.container}>
        {/* Hero секция с заголовком и принципом */}
        <section className={s.hero}>
          <div className={s.heroContent}>
            <h1 className={s.mainTitle}>
              Что мы <span className={s.accent}>можем предложить</span><br />
              вашему ребенку?
            </h1>
            
            {/* Блок с принципом */}
            <div className={s.principleBox}>
              <div className={s.principleIcon}>✨</div>
              <p className={s.principleText}>
                Главный принцип — вера в естественное стремление ребенка к развитию.
              </p>
            </div>
          </div>
          
          {/* <div className={s.principleImageWrapper}>
            <Image
              src="/images/princhip.png"
              alt="Принцип развития детей"
              width={600}
              height={200}
              className={s.principleImage}
              priority
            />
          </div> */}
        </section>

        {/* Карусель с карточками */}
        <section className={s.carouselSection}>
          <div className={s.carouselWrapper}>
            <button 
              onClick={handlePrev} 
              className={s.carouselBtn}
              aria-label="Предыдущая карточка"
            >
              <span className={s.arrow}>←</span>
            </button>

            <div 
              className={s.carouselTrack}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className={s.carouselInner}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`
                }}
              >
                {aboutData.map((card) => (
                  <div key={card.id} className={s.carouselSlide}>
                    <AboutCard 
                      title={card.title}
                      description={card.description}
                      imageSrc={card.imageSrc}
                      imageAlt={card.imageAlt}
                      borderColor={card.borderColor}
                      imagePosition={card.imagePosition}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleNext} 
              className={s.carouselBtn}
              aria-label="Следующая карточка"
            >
              <span className={s.arrow}>→</span>
            </button>
          </div>

          {/* Индикаторы */}
          <div className={s.indicators}>
            {aboutData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`${s.indicator} ${
                  index === currentIndex ? s.indicatorActive : ''
                }`}
                aria-label={`Перейти к карточке ${index + 1}`}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}