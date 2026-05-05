'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

type Skill = {
  id: number;
  name: string;
  icon: string;
  proficiency: number;
  category: string;
  sortOrder: number;
};

const inputCls = "w-full px-4 py-2.5 bg-black border border-neutral-800 rounded-md text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors text-sm";
const labelCls = "block text-xs uppercase tracking-wider font-medium text-neutral-500 mb-1.5";

const PREDEFINED_SKILLS = [
  // Frontend
  { name: 'HTML', icon: 'https://skillicons.dev/icons?i=html', category: 'Frontend' },
  { name: 'CSS', icon: 'https://skillicons.dev/icons?i=css', category: 'Frontend' },
  { name: 'JavaScript', icon: 'https://skillicons.dev/icons?i=js', category: 'Frontend' },
  { name: 'TypeScript', icon: 'https://skillicons.dev/icons?i=ts', category: 'Frontend' },
  { name: 'React', icon: 'https://skillicons.dev/icons?i=react', category: 'Frontend' },
  { name: 'Next.js', icon: 'https://skillicons.dev/icons?i=nextjs', category: 'Frontend' },
  { name: 'Vue.js', icon: 'https://skillicons.dev/icons?i=vue', category: 'Frontend' },
  { name: 'Nuxt.js', icon: 'https://skillicons.dev/icons?i=nuxtjs', category: 'Frontend' },
  { name: 'Angular', icon: 'https://skillicons.dev/icons?i=angular', category: 'Frontend' },
  { name: 'Svelte', icon: 'https://skillicons.dev/icons?i=svelte', category: 'Frontend' },
  { name: 'Tailwind CSS', icon: 'https://skillicons.dev/icons?i=tailwind', category: 'Frontend' },
  { name: 'Bootstrap', icon: 'https://skillicons.dev/icons?i=bootstrap', category: 'Frontend' },
  { name: 'Sass', icon: 'https://skillicons.dev/icons?i=sass', category: 'Frontend' },
  { name: 'Material UI', icon: 'https://skillicons.dev/icons?i=mui', category: 'Frontend' },
  { name: 'Redux', icon: 'https://skillicons.dev/icons?i=redux', category: 'Frontend' },
  { name: 'Three.js', icon: 'https://skillicons.dev/icons?i=threejs', category: 'Frontend' },
  { name: 'Webpack', icon: 'https://skillicons.dev/icons?i=webpack', category: 'Frontend' },
  { name: 'Vite', icon: 'https://skillicons.dev/icons?i=vite', category: 'Frontend' },
  
  // Backend
  { name: 'Node.js', icon: 'https://skillicons.dev/icons?i=nodejs', category: 'Backend' },
  { name: 'Express', icon: 'https://skillicons.dev/icons?i=express', category: 'Backend' },
  { name: 'NestJS', icon: 'https://skillicons.dev/icons?i=nestjs', category: 'Backend' },
  { name: 'Python', icon: 'https://skillicons.dev/icons?i=py', category: 'Backend' },
  { name: 'Django', icon: 'https://skillicons.dev/icons?i=django', category: 'Backend' },
  { name: 'Flask', icon: 'https://skillicons.dev/icons?i=flask', category: 'Backend' },
  { name: 'Java', icon: 'https://skillicons.dev/icons?i=java', category: 'Backend' },
  { name: 'Spring', icon: 'https://skillicons.dev/icons?i=spring', category: 'Backend' },
  { name: 'C#', icon: 'https://skillicons.dev/icons?i=cs', category: 'Backend' },
  { name: '.NET', icon: 'https://skillicons.dev/icons?i=dotnet', category: 'Backend' },
  { name: 'PHP', icon: 'https://skillicons.dev/icons?i=php', category: 'Backend' },
  { name: 'Laravel', icon: 'https://skillicons.dev/icons?i=laravel', category: 'Backend' },
  { name: 'CodeIgniter 4', icon: 'https://skillicons.dev/icons?i=php', category: 'Backend' },
  { name: 'Ruby', icon: 'https://skillicons.dev/icons?i=ruby', category: 'Backend' },
  { name: 'Rails', icon: 'https://skillicons.dev/icons?i=rails', category: 'Backend' },
  { name: 'Go', icon: 'https://skillicons.dev/icons?i=go', category: 'Backend' },
  { name: 'Rust', icon: 'https://skillicons.dev/icons?i=rust', category: 'Backend' },
  { name: 'C++', icon: 'https://skillicons.dev/icons?i=cpp', category: 'Backend' },
  { name: 'C', icon: 'https://skillicons.dev/icons?i=c', category: 'Backend' },
  { name: 'GraphQL', icon: 'https://skillicons.dev/icons?i=graphql', category: 'Backend' },
  
  // Databases
  { name: 'PostgreSQL', icon: 'https://skillicons.dev/icons?i=postgres', category: 'Databases' },
  { name: 'MySQL', icon: 'https://skillicons.dev/icons?i=mysql', category: 'Databases' },
  { name: 'MongoDB', icon: 'https://skillicons.dev/icons?i=mongo', category: 'Databases' },
  { name: 'Redis', icon: 'https://skillicons.dev/icons?i=redis', category: 'Databases' },
  { name: 'SQLite', icon: 'https://skillicons.dev/icons?i=sqlite', category: 'Databases' },
  { name: 'Prisma', icon: 'https://skillicons.dev/icons?i=prisma', category: 'Databases' },
  { name: 'Supabase', icon: 'https://skillicons.dev/icons?i=supabase', category: 'Databases' },
  { name: 'Firebase', icon: 'https://skillicons.dev/icons?i=firebase', category: 'Databases' },
  { name: 'Cassandra', icon: 'https://skillicons.dev/icons?i=cassandra', category: 'Databases' },
  
  // Tools
  { name: 'AWS', icon: 'https://skillicons.dev/icons?i=aws', category: 'Tools' },
  { name: 'Google Cloud', icon: 'https://skillicons.dev/icons?i=gcp', category: 'Tools' },
  { name: 'Azure', icon: 'https://skillicons.dev/icons?i=azure', category: 'Tools' },
  { name: 'Docker', icon: 'https://skillicons.dev/icons?i=docker', category: 'Tools' },
  { name: 'Kubernetes', icon: 'https://skillicons.dev/icons?i=kubernetes', category: 'Tools' },
  { name: 'Linux', icon: 'https://skillicons.dev/icons?i=linux', category: 'Tools' },
  { name: 'Ubuntu', icon: 'https://skillicons.dev/icons?i=ubuntu', category: 'Tools' },
  { name: 'NGINX', icon: 'https://skillicons.dev/icons?i=nginx', category: 'Tools' },
  { name: 'Vercel', icon: 'https://skillicons.dev/icons?i=vercel', category: 'Tools' },
  { name: 'Netlify', icon: 'https://skillicons.dev/icons?i=netlify', category: 'Tools' },
  { name: 'Heroku', icon: 'https://skillicons.dev/icons?i=heroku', category: 'Tools' },
  { name: 'Git', icon: 'https://skillicons.dev/icons?i=git', category: 'Tools' },
  { name: 'GitHub', icon: 'https://skillicons.dev/icons?i=github', category: 'Tools' },
  { name: 'GitLab', icon: 'https://skillicons.dev/icons?i=gitlab', category: 'Tools' },
  { name: 'Jenkins', icon: 'https://skillicons.dev/icons?i=jenkins', category: 'Tools' },
  { name: 'Terraform', icon: 'https://skillicons.dev/icons?i=terraform', category: 'Tools' },

  { name: 'Jest', icon: 'https://skillicons.dev/icons?i=jest', category: 'Tools' },
  { name: 'Cypress', icon: 'https://skillicons.dev/icons?i=cypress', category: 'Tools' },
  { name: 'Selenium', icon: 'https://skillicons.dev/icons?i=selenium', category: 'Tools' },
  { name: 'Postman', icon: 'https://skillicons.dev/icons?i=postman', category: 'Tools' },
  { name: 'Figma', icon: 'https://skillicons.dev/icons?i=figma', category: 'Tools' },
  { name: 'Adobe XD', icon: 'https://skillicons.dev/icons?i=xd', category: 'Tools' },
  { name: 'Photoshop', icon: 'https://skillicons.dev/icons?i=ps', category: 'Tools' },
  { name: 'Illustrator', icon: 'https://skillicons.dev/icons?i=ai', category: 'Tools' },
  { name: 'Notion', icon: 'https://skillicons.dev/icons?i=notion', category: 'Tools' }
];

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState(PREDEFINED_SKILLS[0].name);
  const [icon, setIcon] = useState(PREDEFINED_SKILLS[0].icon);
  const [category, setCategory] = useState(PREDEFINED_SKILLS[0].category);
  const [sortOrder, setSortOrder] = useState(0);

  const handleNameChange = (newName: string) => {
    setName(newName);
    const skill = PREDEFINED_SKILLS.find(s => s.name === newName);
    if (skill) {
      setIcon(skill.icon);
      setCategory(skill.category);
    }
  };

  const availablePredefined = PREDEFINED_SKILLS.filter(
    ps => !skills.find(s => s.name === ps.name && s.id !== editingId)
  );

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/skills');
      if (res.ok) setSkills(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const resetForm = () => {
    setName(PREDEFINED_SKILLS[0].name); 
    setIcon(PREDEFINED_SKILLS[0].icon); 
    setCategory(PREDEFINED_SKILLS[0].category); 
    setSortOrder(0);
    setEditingId(null);
  };

  const handleEdit = (s: Skill) => {
    setName(s.name); setIcon(s.icon);
    setCategory(s.category); setSortOrder(s.sortOrder); setEditingId(s.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this skill?')) return;
    const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
    if (res.ok) fetchSkills();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, icon, proficiency: 100, category, sortOrder };
    const url = editingId && editingId !== -1 ? `/api/admin/skills/${editingId}` : '/api/admin/skills';
    const method = editingId && editingId !== -1 ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { resetForm(); fetchSkills(); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your technical proficiencies.</p>
        </div>
        {editingId === null && (
          <button onClick={() => setEditingId(-1)} className="flex items-center space-x-2 bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Plus size={16} /><span>Add Skill</span>
          </button>
        )}
      </div>

      {/* Form */}
      {editingId !== null && (
        <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-950/40">
          <h2 className="text-base font-semibold text-white mb-5">{editingId === -1 ? 'New Skill' : 'Edit Skill'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Skill Name</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 flex justify-center">
                    <img src={icon} alt={name} className="w-8 h-8 rounded" />
                  </div>
                  <select 
                    value={name} 
                    onChange={e => handleNameChange(e.target.value)} 
                    className={inputCls}
                  >
                    {!availablePredefined.find(s => s.name === name) && (
                      <option value={name}>{name}</option>
                    )}
                    {availablePredefined.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                  {['Frontend','Backend','Databases','Tools'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Sort Order</label><input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className={inputCls} /></div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800">
              <button type="button" onClick={resetForm} className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"><X size={16}/><span>Cancel</span></button>
              <button type="submit" className="flex items-center space-x-2 bg-white hover:bg-neutral-200 text-black px-5 py-2 rounded-md text-sm font-medium transition-colors"><Save size={16}/><span>Save</span></button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : skills.length === 0 ? (
        <div className="border border-neutral-800 rounded-xl p-10 text-center text-neutral-500 text-sm">No skills found. Add your first one!</div>
      ) : (
        <div className="border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3">Icon</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-neutral-950 transition-colors group">
                  <td className="px-5 py-3.5">
                    <img src={skill.icon} alt={skill.name} className="w-6 h-6 rounded" />
                  </td>
                  <td className="px-5 py-3.5 font-medium text-white">{skill.name}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{skill.category}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{skill.sortOrder}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end space-x-1">
                      <button onClick={() => handleEdit(skill)} className="p-1.5 text-neutral-600 hover:text-white rounded transition-colors" title="Edit"><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-neutral-600 hover:text-red-400 rounded transition-colors" title="Delete"><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
