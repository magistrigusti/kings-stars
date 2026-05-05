import { SignIn } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main style={authPageStyle}>
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/register"
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
  background: '#f6fbff',
} satisfies React.CSSProperties;
