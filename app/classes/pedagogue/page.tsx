'use client';

import { useRef, useState, TouchEvent } from 'react';
import Image from 'next/image';
import { IoRibbonOutline } from 'react-icons/io5';
import Navigation from '../../components/Navigation/Navigation';
import { pedagogueCopy } from './pedagogueCopy';
import { PEDAGOGUE_CERTIFICATE_PDF, PEDAGOGUE_PHOTOS, PEDAGOGUE_VIDEO_SRC } from './pedagogueMedia';
import s from './page.module.scss';

// Язык интерфейса: позже — из настроек игрока / контекста
const LOCALE: 'ru' | 'en' = 'ru';

export default function PedagoguePage() {
  const t = pedagogueCopy[LOCALE];
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PEDAGOGUE_PHOTOS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === PEDAGOGUE_PHOTOS.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) handleNext();
    if (touchStartX.current - touchEndX.current < -50) handlePrev();
  };

  return (
    <main className={s.page}>
      <Navigation />

      <div className={s.container}>
        <h1 className={s.heroTitle}>{t.pageTitle}</h1>
        <p className={s.intro}>{t.intro}</p>

        <section className={s.videoSection} aria-labelledby="pedagogue-video-heading">
          <h2 id="pedagogue-video-heading" className={s.sectionLabel}>
            {t.videoCaption}
          </h2>
          <div className={s.videoFrame}>
            <video className={s.video} controls playsInline preload="metadata">
              <source src={PEDAGOGUE_VIDEO_SRC} type="video/mp4" />
            </video>
          </div>
        </section>

        <div className={s.lowerGrid}>
          <section className={s.photoColumn} aria-labelledby="pedagogue-photos-heading">
            <h2 id="pedagogue-photos-heading" className={s.sectionLabel}>
              {t.photosCaption}
            </h2>
            <div
              className={s.sliderTrack}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className={s.sliderInner} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {PEDAGOGUE_PHOTOS.map((photo, index) => (
                  <div key={photo.src} className={s.slide}>
                    <Image
                      src={photo.src}
                      alt={LOCALE === 'ru' ? photo.altRu : photo.altEn}
                      width={600}
                      height={800}
                      className={s.slideImage}
                      sizes="(max-width: 768px) 100vw, 420px"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={s.photoControls}>
              <button type="button" onClick={handlePrev} className={s.photoBtn} aria-label={t.prevPhoto}>
                ←
              </button>
              <div className={s.photoIndicators}>
                {PEDAGOGUE_PHOTOS.map((photo, index) => (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`${s.photoIndicator} ${index === currentIndex ? s.photoIndicatorActive : ''}`}
                    aria-label={t.photoN(index + 1)}
                  />
                ))}
              </div>
              <button type="button" onClick={handleNext} className={s.photoBtn} aria-label={t.nextPhoto}>
                →
              </button>
            </div>
          </section>

          <section className={s.certColumn} aria-labelledby="pedagogue-cert-heading">
            <h2 id="pedagogue-cert-heading" className={s.sectionLabel}>
              {t.certificateTitle}
            </h2>
            <article className={s.certCard}>
              <p className={s.certHint}>{t.certificateDescription}</p>
              <a
                href={PEDAGOGUE_CERTIFICATE_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className={s.certLink}
              >
                <IoRibbonOutline className={s.certIcon} aria-hidden />
                {t.certificateLink}
              </a>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}
