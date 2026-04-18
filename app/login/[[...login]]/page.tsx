import { SignIn } from '@clerk/nextjs';
import AuthShell from '@/app/components/AuthShell/AuthShell';
import s from '@/app/components/AuthShell/AuthShell.module.scss';

const appearance = {
  elements: {
    rootBox: s.clerkRoot,
    cardBox: s.clerkCard,
    formButtonPrimary: s.primaryButton,
  },
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Вход в Страну Улыбок"
      text="Войди через Google, и прогресс тренировок будет сохраняться в общей Network-базе."
      actionHref="/register"
      actionLabel="Создать новый вход"
    >
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/register"
        appearance={appearance}
      />
    </AuthShell>
  );
}
