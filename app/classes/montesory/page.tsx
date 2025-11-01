'use client';
import Navigation from '../../components/Navigation/Navigation';
import Image from 'next/image';
import { montessoriData } from './montesoriData';
import s from './page.module.scss';

export default function MontessoriPage() {
  return (
    <main className={s.montessori}>
      <Navigation />
      
      <div className={s.container}>
        {/* Hero секция */}
        <section className={s.hero}>
          <div className={s.heroContent}>
            <h1 className={s.heroTitle}>
              {montessoriData.hero.title}
            </h1>
          </div>
          
          <div className={s.heroImage}>
            <Image
              src={montessoriData.hero.imageSrc}
              alt={montessoriData.hero.imageAlt}
              width={400}
              height={500}
              className={s.mariaImage}
              priority
            />
          </div>
        </section>

        {/* Секции с информацией */}
        <section className={s.content}>
          {montessoriData.sections.map((section) => (
            <article key={section.id} className={s.section}>
              <h2 className={s.sectionTitle}>{section.title}</h2>
              <p className={s.sectionContent}>{section.content}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}