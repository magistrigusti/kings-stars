import Link from 'next/link';
import type { ReactNode } from 'react';
import s from './AuthShell.module.scss';

interface AuthShellProps {
  title: string;
  text: string;
  actionHref: string;
  actionLabel: string;
  children: ReactNode;
}

export default function AuthShell({
  title,
  text,
  actionHref,
  actionLabel,
  children,
}: AuthShellProps) {
  return (
    <main className={s.shell}>
      <section className={s.content} aria-labelledby="auth-title">
        <p className={s.kicker}>Страна Улыбок</p>
        <h1 id="auth-title">{title}</h1>
        <p>{text}</p>
        <Link href={actionHref} className={s.switchLink}>
          {actionLabel}
        </Link>
      </section>

      <section className={s.form} aria-label={title}>
        {children}
      </section>
    </main>
  );
}
