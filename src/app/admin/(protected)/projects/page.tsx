'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ExternalLink, GitBranch, Star, FolderGit2, UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  tags: string[];
  featured: boolean;
};

const inputCls = "w-full px-4 py-2.5 bg-black border border-neutral-800 rounded-md text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors text-sm";
const labelCls = "block text-xs uppercase tracking-wider font-medium text-neutral-500 mb-1.5";

const PREDEFINED_TAGS = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Nuxt.js', 
  'Angular', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'Sass', 'Material UI', 'Redux', 
  'Three.js', 'Webpack', 'Vite', 'Node.js', 'Express', 'NestJS', 'Python', 'Django', 
  'Flask', 'Java', 'Spring', 'C#', '.NET', 'PHP', 'Laravel', 'CodeIgniter 4', 'Ruby', 
  'Rails', 'Go', 'Rust', 'C++', 'C', 'GraphQL', 'PostgreSQL', 'MySQL', 'MongoDB', 
  'Redis', 'SQLite', 'Prisma', 'Supabase', 'Firebase', 'Cassandra', 'AWS', 
  'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Linux', 'Ubuntu', 'NGINX', 
  'Vercel', 'Netlify', 'Heroku', 'Git', 'GitHub', 'GitLab', 'Jenkins', 'Terraform', 
  'Jest', 'Cypress', 'Selenium', 'Postman', 'Figma', 'Adobe XD', 'Photoshop', 
  'Illustrator', 'Notion'
].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) setProjects(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const resetForm = () => {
    setTitle(''); setDescription(''); setImageUrl(''); setLiveUrl('');
    setGithubUrl(''); setTags(''); setFeatured(false); setEditingId(null);
  };

  const handleEdit = (p: Project) => {
    setTitle(p.title); setDescription(p.description); setImageUrl(p.imageUrl || '');
    setLiveUrl(p.liveUrl || ''); setGithubUrl(p.githubUrl || '');
    setTags(p.tags.join(', ')); setFeatured(p.featured); setEditingId(p.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    if (res.ok) fetchProjects();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, description, imageUrl, liveUrl, githubUrl, tags, featured };
    const url = editingId && editingId !== -1 ? `/api/admin/projects/${editingId}` : '/api/admin/projects';
    const method = editingId && editingId !== -1 ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { resetForm(); fetchProjects(); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-neutral-500 text-sm mt-1">Showcase your recent work.</p>
        </div>
        {editingId === null && (
          <button onClick={() => setEditingId(-1)} className="flex items-center space-x-2 bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Plus size={16}/><span>Add Project</span>
          </button>
        )}
      </div>

      {/* Form */}
      {editingId !== null && (
        <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-950/40">
          <h2 className="text-base font-semibold text-white mb-5">{editingId === -1 ? 'New Project' : 'Edit Project'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className={labelCls}>Title</label><input type="text" required value={title} onChange={e => setTitle(e.target.value)} className={inputCls}/></div>
              <div className="md:col-span-2"><label className={labelCls}>Description</label><textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputCls}/></div>
              <div className="md:col-span-2">
                <label className={labelCls}>Project Image</label>
                <div className="flex items-center space-x-4">
                  {imageUrl ? (
                    <div className="relative w-24 h-16 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 bg-black/50 p-1 rounded hover:bg-black"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ) : null}
                  
                  <label className="flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 px-4 py-2 rounded-md cursor-pointer transition-colors text-sm">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                    <span>{imageUrl ? 'Change Image' : 'Upload Image'}</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                          if (res.ok) {
                            const data = await res.json();
                            setImageUrl(data.url);
                          }
                        } catch (err) { console.error(err); }
                        setUploading(false);
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
              <div><label className={labelCls}>Live URL</label><input type="text" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className={inputCls}/></div>
              <div><label className={labelCls}>GitHub URL</label><input type="text" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className={inputCls}/></div>
              <div>
                <label className={labelCls}>Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.split(',').filter(t => t.trim() !== '').map((tag, idx) => (
                    <span key={idx} className="flex items-center space-x-1.5 bg-neutral-800 text-white px-2.5 py-1 rounded-md text-xs border border-neutral-700">
                      <span>{tag.trim()}</span>
                      <button 
                        type="button" 
                        onClick={() => setTags(tags.split(',').map(t=>t.trim()).filter(t => t && t !== tag.trim()).join(', '))}
                        className="text-neutral-400 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select 
                  className={inputCls} 
                  value=""
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (!selected) return;
                    const currentTags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
                    if (!currentTags.includes(selected)) {
                      setTags(currentTags.length > 0 ? `${tags}, ${selected}` : selected);
                    }
                  }}
                >
                  <option value="">Add a tag...</option>
                  {PREDEFINED_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center mt-2">
                <button 
                  type="button" 
                  onClick={() => setFeatured(!featured)}
                  className="flex items-center space-x-2 text-sm text-neutral-400 hover:text-white transition-colors group"
                >
                  <Star 
                    size={22} 
                    className={`transition-colors ${featured ? "text-yellow-400" : "text-neutral-600 group-hover:text-neutral-400"}`} 
                    fill={featured ? "currentColor" : "none"} 
                  />
                  <span className={featured ? "text-white" : ""}>{featured ? 'Featured Project' : 'Mark as Featured'}</span>
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800">
              <button type="button" onClick={resetForm} className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-400 hover:text-white"><X size={16}/><span>Cancel</span></button>
              <button type="submit" className="flex items-center space-x-2 bg-white hover:bg-neutral-200 text-black px-5 py-2 rounded-md text-sm font-medium"><Save size={16}/><span>Save</span></button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : projects.length === 0 ? (
        <div className="border border-neutral-800 rounded-xl p-10 text-center text-neutral-500 text-sm">No projects found. Add your first one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project) => (
            <div key={project.id} className="border border-neutral-800 rounded-xl overflow-hidden group hover:border-neutral-600 transition-colors flex flex-col relative">
              {project.featured && (
                <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm border border-neutral-700 p-1.5 rounded-full">
                  <Star size={13} className="text-yellow-400" fill="currentColor"/>
                </div>
              )}
              {project.imageUrl ? (
                <div className="h-40 overflow-hidden bg-neutral-950 relative">
                  <Image src={project.imageUrl} alt={project.title} fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                </div>
              ) : (
                <div className="h-40 bg-neutral-950 flex items-center justify-center border-b border-neutral-800">
                  <FolderGit2 size={36} className="text-neutral-800"/>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-base font-bold text-white mb-1.5">{project.title}</h3>
                <p className="text-neutral-500 text-sm line-clamp-2 mb-3 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 border border-neutral-800 text-neutral-500 text-xs rounded">{tag}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-neutral-900">
                  <div className="flex space-x-3">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-white transition-colors"><ExternalLink size={16}/></a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-white transition-colors"><GitBranch size={16}/></a>}
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => handleEdit(project)} className="p-1.5 text-neutral-600 hover:text-white rounded transition-colors"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(project.id)} className="p-1.5 text-neutral-600 hover:text-red-400 rounded transition-colors"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
