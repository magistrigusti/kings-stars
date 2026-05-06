"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import {
  IoBookOutline,
  IoSchool,
  IoPeopleOutline,
  IoFitnessOutline,
  IoCallOutline,
  IoLogInOutline,
  IoMoonOutline,
  IoPersonOutline,
  IoSunnyOutline,
} from 'react-icons/io5';
import s from './Navigation.module.scss';

const THEME_STORAGE_KEY = 'training-theme-mode';
const THEME_STORAGE_EVENT = 'training-theme-mode-change';

function readThemeMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

function applyThemeMode(isDarkMode: boolean) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
}

export default function Navigation() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const syncThemeMode = () => {
      const nextThemeMode = readThemeMode();
      setIsDarkMode(nextThemeMode);
      applyThemeMode(nextThemeMode);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        syncThemeMode();
      }
    };

    syncThemeMode();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(THEME_STORAGE_EVENT, syncThemeMode);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(THEME_STORAGE_EVENT, syncThemeMode);
    };
  }, []);

  const handleThemeToggle = useCallback(() => {
    const nextThemeMode = !isDarkMode;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextThemeMode ? 'dark' : 'light');
    } catch {}

    setIsDarkMode(nextThemeMode);
    applyThemeMode(nextThemeMode);
    window.dispatchEvent(new Event(THEME_STORAGE_EVENT));
  }, [isDarkMode]);

  return (
    <nav className={s.nav}>
      <div className={s.container}>
        <div className={s.brand}>
        <Link href="/" className={s.logo}>
          <Image 
            src="/images/logo/image.png"
            alt="Страна Улыбок"
            width={180}
            height={180}
            priority
          />
        </Link>

          <button
            type="button"
            className={s.themeToggle}
            onClick={handleThemeToggle}
            aria-label={isDarkMode ? 'Включить светлую тему сайта' : 'Включить тёмную тему сайта'}
            title={isDarkMode ? 'Светлая тема' : 'Тёмная тема'}
          >
            {isDarkMode ? <IoMoonOutline /> : <IoSunnyOutline />}
          </button>
        </div>
        
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
              href="/training/brain"
              className={
                pathname === '/training/brain'
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
          {isLoaded && isSignedIn ? (
            <div className={s.userButton}>
              <UserButton />
            </div>
          ) : (
            <Link href="/login" className={s.authBtn} aria-label="Войти">
              <IoLogInOutline className={s.authIcon} />
            </Link>
          )}

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
