'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

const inputCls = "w-full px-4 py-2.5 bg-black border border-neutral-800 rounded-md text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors text-sm";
const labelCls = "block text-xs uppercase tracking-wider font-medium text-neutral-500 mb-1.5";

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState({
    bio: '',
    github_link: '',
    linkedin_link: '',
    twitter_link: '',
    email_address: '',
    hero_badge_text: '',
    occupation_title: '',
    logo_text: '',
    name: '',
    about_heading: '',
    about_text: '',
    resume_url: '',
    stat_1_title: '', stat_1_subtitle: '',
    stat_2_title: '', stat_2_subtitle: '',
    stat_3_title: '', stat_3_subtitle: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-neutral-500 text-sm">Loading…</p>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Update your portfolio metadata.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Branding */}
        <section className="border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider pb-3 border-b border-neutral-900">
            Branding & Identity
          </h2>
          <div>
            <label className={labelCls}>Navbar Logo Text</label>
            <input
              type="text"
              name="logo_text"
              value={settings.logo_text || ''}
              onChange={handleChange}
              placeholder="e.g. KG."
              className={inputCls}
            />
            <p className="text-[10px] text-neutral-600 mt-1 uppercase tracking-tight">
              Appears in the navigation bar. If empty, initials from Full Name will be used.
            </p>
          </div>
        </section>

        {/* Hero */}
        <section className="border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider pb-3 border-b border-neutral-900">
            Hero Section
          </h2>
          <div>
            <label className={labelCls}>Full Name</label>
            <input
              type="text"
              name="name"
              value={settings.name || ''}
              onChange={handleChange}
              placeholder="Keshav Ghai"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Badge Text</label>
            <input
              type="text"
              name="hero_badge_text"
              value={settings.hero_badge_text}
              onChange={handleChange}
              placeholder="Available for new opportunities"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Occupation Title</label>
            <input
              type="text"
              name="occupation_title"
              value={settings.occupation_title}
              onChange={handleChange}
              placeholder="Senior Full-Stack Engineer & 3D UI Developer"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Short Bio</label>
            <textarea
              name="bio"
              value={settings.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Building exceptional digital experiences…"
              className={inputCls}
            />
          </div>
        </section>

        {/* About Section */}
        <section className="border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider pb-3 border-b border-neutral-900">
            About Section
          </h2>
          <div>
            <label className={labelCls}>About Heading</label>
            <input
              type="text"
              name="about_heading"
              value={settings.about_heading || ''}
              onChange={handleChange}
              placeholder="Building the future..."
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>About Text</label>
            <textarea
              name="about_text"
              value={settings.about_text || ''}
              onChange={handleChange}
              rows={5}
              placeholder="I am a passionate Full-Stack Engineer..."
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Resume Link</label>
            <input
              type="text"
              name="resume_url"
              value={settings.resume_url || ''}
              onChange={handleChange}
              placeholder="/resume.pdf or https://..."
              className={inputCls}
            />
          </div>
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 border border-neutral-800 p-4 rounded-lg">
              <label className={labelCls}>Stat 1 (e.g. Terminal Icon)</label>
              <input type="text" name="stat_1_title" value={settings.stat_1_title || ''} onChange={handleChange} placeholder="Title (e.g. 10+ Tech Stacks)" className={inputCls} />
              <input type="text" name="stat_1_subtitle" value={settings.stat_1_subtitle || ''} onChange={handleChange} placeholder="Subtitle" className={inputCls} />
            </div>
            <div className="space-y-2 border border-neutral-800 p-4 rounded-lg">
              <label className={labelCls}>Stat 2 (e.g. Briefcase Icon)</label>
              <input type="text" name="stat_2_title" value={settings.stat_2_title || ''} onChange={handleChange} placeholder="Title (e.g. 5+ Years)" className={inputCls} />
              <input type="text" name="stat_2_subtitle" value={settings.stat_2_subtitle || ''} onChange={handleChange} placeholder="Subtitle" className={inputCls} />
            </div>
            <div className="space-y-2 border border-neutral-800 p-4 rounded-lg">
              <label className={labelCls}>Stat 3 (e.g. Graduation Cap)</label>
              <input type="text" name="stat_3_title" value={settings.stat_3_title || ''} onChange={handleChange} placeholder="Title (e.g. B.S. Comp Sci)" className={inputCls} />
              <input type="text" name="stat_3_subtitle" value={settings.stat_3_subtitle || ''} onChange={handleChange} placeholder="Subtitle" className={inputCls} />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider pb-3 border-b border-neutral-900">
            Social Links
          </h2>
          <div>
            <label className={labelCls}>GitHub</label>
            <input
              type="url"
              name="github_link"
              value={settings.github_link}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>LinkedIn</label>
            <input
              type="url"
              name="linkedin_link"
              value={settings.linkedin_link}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Twitter / X</label>
            <input
              type="url"
              name="twitter_link"
              value={settings.twitter_link}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              className={inputCls}
            />
          </div>
        </section>

        {/* Contact */}
        <section className="border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider pb-3 border-b border-neutral-900">
            Contact
          </h2>
          <div>
            <label className={labelCls}>Primary Email</label>
            <input
              type="email"
              name="email_address"
              value={settings.email_address}
              onChange={handleChange}
              placeholder="hello@example.com"
              className={inputCls}
            />
          </div>
        </section>

        <div className="flex items-center justify-end space-x-4">
          {saved && (
            <span className="flex items-center text-green-500 text-sm">
              <CheckCircle size={15} className="mr-1.5" />
              Saved
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-md font-medium disabled:opacity-40 text-sm transition-colors"
          >
            <Save size={16} />
            <span>{saving ? 'Saving…' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
