import Image from 'next/image';
import s from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={s.hero}>
      

      {/* Фото с детьми - акцент на передних девочках */}
      <div className={s.kidsPhoto}>
        <Image
          src="/images/hero/image.png"
          alt="Дети рисуют"
          width={600}
          height={800}
          className={s.kidsImage}
        />
      </div>

      

      <div className={s.container}>
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

      <div className={s.decorBanner}>
        
        <p className={s.bannerText}>
        ★ частный детский сад по методу Монтессори
        </p>
      </div>
    </section>
  );
}