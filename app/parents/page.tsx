import Navigation from '../components/Navigation/Navigation';
import ParentsZone from './components/ParentsZone/ParentsZone';
import s from './page.module.scss';

export default function ParentsPage() {
  return (
    <main className={s.parents}>
      <Navigation />
      <ParentsZone />
    </main>
  );
}
