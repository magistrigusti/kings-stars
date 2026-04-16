import Navigation from '../components/Navigation/Navigation';
import TrainingZone from './components/TrainingZone/TrainingZone';
import s from './page.module.scss';

export default function BrainTrainingPage() {
  return (
    <main className={s.page}>
      <Navigation />
      <TrainingZone />
    </main>
  );
}
