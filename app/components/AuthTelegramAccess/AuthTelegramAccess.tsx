import { IoPaperPlaneOutline } from 'react-icons/io5';
import { authTelegramAccessContent } from './AuthTelegramAccess.content';
import s from './AuthTelegramAccess.module.scss';

const TELEGRAM_LOGIN_START_URL = '/api/auth/telegram/start';

export default function AuthTelegramAccess() {
  const content = authTelegramAccessContent.ru;

  return (
    <section className={s.telegramAccess} aria-label={content.ariaLabel}>
      <div className={s.divider}>{content.divider}</div>

      <a
        className={s.telegramButton}
        href={TELEGRAM_LOGIN_START_URL}
        aria-label={content.ariaLabel}
      >
        <IoPaperPlaneOutline className={s.telegramIcon} aria-hidden="true" />
        <span className={s.telegramText}>
          <span className={s.telegramTitle}>{content.title}</span>
          <span className={s.telegramCaption}>{content.caption}</span>
        </span>
      </a>
    </section>
  );
}
