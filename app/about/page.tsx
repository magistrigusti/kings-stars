'use client';
import { useState } from 'react';
import AboutCard from '../components/AboutCard/AboutCard';
import { aboutData } from './aboutData';
import Image from 'next/image';
import s from './page.module.scss';
import Navigation from '../components/Navigation/Navigation';

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => prev === 0 ? aboutData.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev === aboutData.length - 1 ? 0 : prev + 1);
  };

  return (
    <main className={s.about}>
      <Navigation />

      <div className={s.container}>
        <div className={s.header}>
          <div className={s.headerText}>
          <h1 className={s.mainTitle}>
              Что мы 
              <span className={s.accent}>можем предложить</span><br />
              вашему ребенку?
            </h1>
          </div>

          <div className={s.principleImage}>
            <Image
              src="/images/princhip.png"
              alt="Принцип"
              width={800}
              height={200}
              className={s.principle}
            />
          </div>
        </div>

        <div className={s.carouselWrapper}>
          <button
            onClick={handlePrev}
            className={s.carouselBtn}
            aria-label="Предыдущая карточка"
          >
            ←
          </button>

          <div className={s.carouselTrack}>
            <div className={s.carouselInner}
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
            →
          </button>
        </div>

        <div className={s.indicators}>
          {aboutData.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                ${s.indicator}
                ${index === currentIndex ? s.indicatorActive : ''}  
              `}
              aria-label={`Перейти к карточке ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}