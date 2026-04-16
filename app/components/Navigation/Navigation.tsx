"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  IoBookOutline,
  IoSchool,
  IoPeopleOutline,
  IoFitnessOutline,
  IoCallOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import s from './Navigation.module.scss';

export default function Navigation() {
  const pathname = usePathname();

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
            <Link 
              href="/about" 
              className={pathname === '/about' ? `${s.active}` : ''}
            >
              <IoSchool className={s.icon} />
              <span className={s.text}>О нас</span>
            </Link>
          </li>
          <li>
            <Link
              href="/classes/montesory"
              className={pathname === '/classes/montesory' ? `${s.active}` : ''}
            >
              <IoBookOutline className={s.icon} />
              <span className={s.text}>Монтессори и Реджио</span>
            </Link>
          </li>
          <li>
            <Link
              href="/classes/pedagogue"
              className={pathname === '/classes/pedagogue' ? `${s.active}` : ''}
            >
              <IoPersonOutline className={s.icon} />
              <span className={s.text}>Педагог</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/parents"
              className={pathname === '/parents' ? `${s.active}` : ''}
            >
              <IoPeopleOutline className={s.icon} />
              <span className={s.text}>Для родителей</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/brain-training"
              className={
                pathname === '/brain-training' 
                  ? `${s.active}` 
                  : ''
              }
            >
              <IoFitnessOutline className={s.icon} />
              <span className={s.text}>Тренировки</span>
            </Link>
          </li>
        </ul>

        <div className={s.contact}>
          <a 
            href="https://t.me/Gyuivvv" 
            target="_blank" 
            rel="noopener noreferrer"
            className={s.btn}
            
          >
            <IoCallOutline className={s.btnIcon} />
           
          </a>
        </div>
      </div>
    </nav>
  );
}
