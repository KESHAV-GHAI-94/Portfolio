import Link from 'next/link';
import { Code, FolderGit2, FileText, Mail } from 'lucide-react';
import prisma from '@/backend/db/prisma';

export default async function DashboardPage() {
  let stats = { skills: 0, projects: 0, blogPosts: 0, messages: 0 };

  try {
    const [skillsCount, projectsCount, blogCount, messagesCount] = await Promise.all([
      prisma.skill.count(),
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.contactSubmission.count({ where: { read: false } })
    ]);
    stats = { skills: skillsCount, projects: projectsCount, blogPosts: blogCount, messages: messagesCount };
  } catch (error) {
    console.error('Database connection failed for stats', error);
  }

  const statCards = [
    { icon: Code,        label: 'Total Skills',      value: stats.skills,    href: '/admin/skills'   },
    { icon: FolderGit2,  label: 'Projects',          value: stats.projects,  href: '/admin/projects' },
    { icon: FileText,    label: 'Published Posts',   value: stats.blogPosts, href: '/admin/blog'     },
    { icon: Mail,        label: 'Unread Messages',   value: stats.messages,  href: '/admin/contact', alert: stats.messages > 0 },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-neutral-500 text-sm">Overview of your portfolio content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, href, alert }) => (
          <Link
            key={href}
            href={href}
            className="group border border-neutral-900 rounded-xl p-6 hover:border-neutral-700 transition-colors bg-neutral-950/50"
          >
            <div className="flex items-start justify-between mb-4">
              <Icon size={20} className="text-neutral-500 group-hover:text-white transition-colors" />
              {alert && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm uppercase tracking-wider text-neutral-500 font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Skill',    href: '/admin/skills'   },
            { label: 'Add Project',  href: '/admin/projects' },
            { label: 'Write Post',   href: '/admin/blog'     },
            { label: 'View Inbox',   href: '/admin/contact'  },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-3 border border-neutral-800 rounded-md text-sm text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors text-center font-medium"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
