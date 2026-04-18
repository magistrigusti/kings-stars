'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function NetworkIdentitySync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      return;
    }

    fetch('/api/network/profile', { cache: 'no-store' }).catch(() => {});
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
}
