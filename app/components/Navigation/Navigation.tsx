import Link from 'next/link';
import Image from 'next/image';
import { IoBookOutline, IoSchool } from 'react-icons/io5';
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
          <li>
            <Link href="/about">
              <IoSchool className={s.icon} />
              <span className={s.text}>О нас</span>
            </Link>
          </li>
          <li>
            <Link href="/classes/montesory">
              <IoBookOutline className={s.icon} />
              <span className={s.text}>Монтессори и Реджио</span>
            </Link>
          </li>
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