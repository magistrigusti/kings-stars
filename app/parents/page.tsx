"use client"

import Navigation from '../components/Navigation/Navigation';
import AdviceCard from '../components/AdviceCard/AdviceCard';
import { parentsData } from './parentsData';
import s from './page.module.scss';

export default function ParentsPage() {
  return (
    <main className={s.parents}>
      <Navigation />
      
      <div className={s.container}>
        <header className={s.header}>
          <h1 className={s.title}>
            Советы для <span className={s.accent}>родителей</span>
          </h1>
          <p className={s.subtitle}>
            Полезные рекомендации от наших педагогов и психологов для гармоничного развития вашего ребенка
          </p>
        </header>

        <div className={s.content}>
          {parentsData.map((post) => (
            <AdviceCard
              key={post.id}
              title={post.title}
              imageSrc={post.imageSrc}
              imageAlt={post.imageAlt}
              advices={post.advices}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
