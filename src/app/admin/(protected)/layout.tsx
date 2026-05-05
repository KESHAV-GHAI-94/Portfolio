import Link from 'next/link';
import { LayoutDashboard, Code, FolderGit2, FileText, Mail, Settings } from 'lucide-react';
import LogoutButton from '@/frontend/components/admin/LogoutButton';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/skills',    icon: Code,            label: 'Skills' },
  { href: '/admin/projects',  icon: FolderGit2,      label: 'Projects' },
  { href: '/admin/blog',      icon: FileText,        label: 'Blog' },
  { href: '/admin/contact',   icon: Mail,            label: 'Messages' },
  { href: '/admin/settings',  icon: Settings,        label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-neutral-900 bg-black">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-neutral-900">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500">
            Portfolio
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">Admin Panel</h2>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors text-sm font-medium"
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-neutral-900">
          <LogoutButton />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
