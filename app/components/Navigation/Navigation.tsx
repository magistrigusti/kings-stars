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
          <li><Link href="/about">О нас</Link></li>
          <li><Link href="/enrollment">Монтессори и Реджио</Link></li>
          <li><Link href="/contact">Контакты</Link></li>
        </ul>

        <div className={s.contact}>
          <div className={s.contactInfo}>
            <p className={s.address}>Элуктросталь, ул. Профсоюзная, 92</p>
            <a href="tel:+79685287828" className={s.phone}>
             +7 968 528 7828
            </a>
          </div>
          <a 
            href="https://t.me/+79685287828" 
            target="_blank" 
            rel="noopener noreferrer"
            className={s.btn}
          >
            Позвоните мне
          </a>
        </div>
      </div>
    </nav>
  );
}