'use client';

import { useEffect } from 'react';

export default function NetworkIdentitySync() {
  useEffect(() => {
    fetch('/api/network/profile', { cache: 'no-store' }).catch(() => {});
  }, []);

  return null;
}
