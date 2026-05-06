import { SignUp } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <main style={authPageStyle}>
      <SignUp
        routing="path"
        path="/register"
        signInUrl="/login"
        forceRedirectUrl="/training/brain"
      />
    </main>
  );
}

const authPageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: 'var(--auth-page-bg, #f6fbff)',
} satisfies React.CSSProperties;
