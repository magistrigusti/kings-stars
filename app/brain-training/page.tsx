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

        <div className={s.instructions}>
          <p className={s.instructionsText}>
            Тренировка обоих полушарий через координацию речи и движений.
            Произноси букву вслух и выполняй действие: <b>Л</b> — левая, <b>П</b> — правая, <b>О</b> — обе.
          </p>
        </div>

        <BrainTrainer />
      </div>
    </main>
  );
}