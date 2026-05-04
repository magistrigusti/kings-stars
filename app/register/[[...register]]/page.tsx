import { SignUp } from '@clerk/nextjs';
import AuthShell from '@/app/components/AuthShell/AuthShell';
import PortalLoginButton from '@/app/components/AuthShell/PortalLoginButton';
import s from '@/app/components/AuthShell/AuthShell.module.scss';

const appearance = {
  elements: {
    rootBox: s.clerkRoot,
    cardBox: s.clerkCard,
    formButtonPrimary: s.primaryButton,
  },
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Новый вход для семьи"
      text="Создай вход через Google, чтобы занятия мозга и дыхания не терялись между устройствами."
      actionHref="/login"
      actionLabel="Уже есть вход"
    >
      <SignUp
        path="/register"
        routing="path"
        signInUrl="/login"
        appearance={appearance}
      />
      <PortalLoginButton />
    </AuthShell>
  );
}
