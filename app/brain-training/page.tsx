'use client';

import Navigation from '../components/Navigation/Navigation';
import BrainTrainer from './BrainTrainer';
import s from './page.module.scss';

export default function BrainTrainingPage() {
  return (
    <main className={s.page}>
      <Navigation />

      <div className={s.container}>
        <h1 className={s.title}>
          Тренажёр <span className={s.accent}>мозга</span>
        </h1>

        <BrainTrainer />
      </div>
    </main>
  );
}