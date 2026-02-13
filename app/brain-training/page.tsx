'use client';

import Navigation from '../components/Navigation/Navigation';
import BrainTrainer from './BrainTrainer';
import s from './page.module.scss';

export default function BrainTrainingPage() {
  return (
    <main className={s.page}>
      <Navigation />

      <div className={s.container}>
        {/* Описание упражнения */}
        <section className={s.intro}>
          <h1 className={s.title}>
            Тренажёр <span className={s.accent}>мозга</span>
          </h1>
          <p className={s.description}>
            Тренировка обоих полушарий через координацию 
            речи и движений. Произноси букву вслух 
            и выполняй действие по указателю:
          </p>
          <div className={s.legend}>
            <span className={s.legendItem}>
              <b>Л</b> — левая
            </span>
            <span className={s.legendItem}>
              <b>П</b> — правая
            </span>
            <span className={s.legendItem}>
              <b>О</b> — обе
            </span>
          </div>
        </section>

        {/* Тренажёр */}
        <BrainTrainer />
      </div>
    </main>
  );
}
