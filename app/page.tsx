import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import s from './page.module.scss';

export default function Home() {
  return (
    <div className={s.page}>
      <Navigation />
      <Hero />
      {/* Дальше добавим остальные секции */}
    </div>
  );
}