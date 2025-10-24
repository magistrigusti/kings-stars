import Link from 'next/link';
import Image from 'next/image';
import s from './Navigation.module.scss';

export default function Navigation() {
  return (
    <nav className={s.nav}>
      <div className={s.container}>
        <Link href="/" className={s.logo}>
          <Image 
            src="/images/logo/image.png"
            alt="Страна Улыбок"
            width={180}
            height={180}
            priority
          />
        </Link>
        
        <ul className={s.menu}>
          <li><Link href="/#about">О нас</Link></li>
          <li><Link href="/#enrollment">Монтессори и Реджио</Link></li>
          <li><Link href="/#contact">Контакты</Link></li>
        </ul>

        <div className={s.contact}>
          <div className={s.contactInfo}>
            <p className={s.address}>Элуктросталь, ул. Профсоюзная, 92</p>
            <a href="tel:+74954077835" className={s.phone}>
              +7 (495) 407-78-35
            </a>
          </div>
          <button className={s.btn}>Позвоните мне</button>
        </div>
      </div>
    </nav>
  );
}