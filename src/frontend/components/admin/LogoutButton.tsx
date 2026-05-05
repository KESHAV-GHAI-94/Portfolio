'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-neutral-500 hover:text-red-400 hover:bg-neutral-900 transition-colors"
    >
      <LogOut size={17} />
      <span>Sign Out</span>
    </button>
  );
}
