'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ExternalLink, CheckCircle, XCircle, Upload, Loader2 } from 'lucide-react';
import TiptapEditor from '@/frontend/components/admin/TiptapEditor';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
};

const inputCls = "w-full px-4 py-2.5 bg-black border border-neutral-800 rounded-md text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors text-sm";
const labelCls = "block text-xs uppercase tracking-wider font-medium text-neutral-500 mb-1.5";

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingId === -1 && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, editingId]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) setPosts(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setTitle(''); setSlug(''); setContent(''); setTags(''); setImageUrl(''); setPublished(false); setEditingId(null);
  };

  const handleEdit = (post: BlogPost) => {
    setTitle(post.title); setSlug(post.slug); setContent(post.content);
    setTags(post.tags.join(', ')); setImageUrl(post.imageUrl || ''); setPublished(post.published); setEditingId(post.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    if (res.ok) fetchPosts();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, slug, content, tags, published, imageUrl };
    const url = editingId && editingId !== -1 ? `/api/admin/blog/${editingId}` : '/api/admin/blog';
    const method = editingId && editingId !== -1 ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { resetForm(); fetchPosts(); }
    else { const err = await res.json(); alert(err.error || 'Failed to save'); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog</h1>
          <p className="text-neutral-500 text-sm mt-1">Write and publish your articles.</p>
        </div>
        {editingId === null && (
          <button onClick={() => setEditingId(-1)} className="flex items-center space-x-2 bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Plus size={16}/><span>Write Post</span>
          </button>
        )}
      </div>

      {/* Form */}
      {editingId !== null && (
        <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-950/40">
          <h2 className="text-base font-semibold text-white mb-5">{editingId === -1 ? 'New Post' : 'Edit Post'}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className={`${inputCls} text-base`} placeholder="Post title…"/>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>URL Slug</label>
                <div className="flex items-center">
                  <span className="px-4 py-2.5 bg-neutral-950 border border-neutral-800 border-r-0 rounded-l-md text-neutral-600 text-sm select-none">/blog/</span>
                  <input type="text" required value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))} className="flex-1 px-4 py-2.5 bg-black border border-neutral-800 rounded-r-md text-white focus:outline-none focus:border-white text-sm font-mono"/>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Content</label>
                <TiptapEditor content={content} onChange={setContent}/>
              </div>
              <div>
                <label className={labelCls}>Tags (comma-separated)</label>
                <input type="text" required value={tags} onChange={e => setTags(e.target.value)} placeholder="Tutorial, React, 3D" className={inputCls}/>
              </div>
              <div>
                <label className={labelCls}>Cover Image</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="URL or upload image..." className={inputCls}/>
                    <label className="flex items-center justify-center px-4 bg-neutral-900 border border-neutral-800 rounded-md cursor-pointer hover:bg-neutral-800 transition-colors shrink-0">
                      {uploading ? <Loader2 size={18} className="animate-spin text-neutral-400" /> : <Upload size={18} className="text-neutral-400" />}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>
                  {imageUrl && (
                    <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-neutral-800 group">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center mt-6 space-x-3 cursor-pointer" onClick={() => setPublished(!published)}>
                <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${published ? 'bg-white' : 'bg-neutral-800'}`}>
                  <div className={`w-4 h-4 bg-black rounded-full shadow transition-transform ${published ? 'translate-x-5' : ''}`}/>
                </div>
                <span className="text-sm text-neutral-400 select-none">
                  {published ? <span className="text-white flex items-center"><CheckCircle size={14} className="mr-1"/>Publish now</span> : <span className="flex items-center"><XCircle size={14} className="mr-1"/>Save as draft</span>}
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800">
              <button type="button" onClick={resetForm} className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-400 hover:text-white"><X size={16}/><span>Cancel</span></button>
              <button type="submit" className="flex items-center space-x-2 bg-white hover:bg-neutral-200 text-black px-5 py-2 rounded-md text-sm font-medium"><Save size={16}/><span>{published ? 'Publish' : 'Save Draft'}</span></button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="border border-neutral-800 rounded-xl p-10 text-center text-neutral-500 text-sm">No posts yet. Start writing!</div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="border border-neutral-800 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center justify-between group hover:border-neutral-600 transition-colors">
              <div className="flex-1 pr-4 mb-3 md:mb-0">
                <div className="flex items-center space-x-3 mb-1">
                  {post.imageUrl && (
                    <div className="w-10 h-10 rounded overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-semibold text-white">{post.title}</h3>
                    {post.published
                      ? <span className="text-[10px] uppercase tracking-wider font-bold text-green-500 border border-green-900/50 px-2 py-0.5 rounded">Live</span>
                      : <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded">Draft</span>
                    }
                  </div>
                </div>
                <p className="text-xs text-neutral-600 font-mono">/blog/{post.slug}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {post.tags.map((tag, i) => <span key={i} className="px-2 py-0.5 border border-neutral-800 text-neutral-500 text-xs rounded">{tag}</span>)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-700 hidden md:block mr-2">{new Date(post.createdAt).toLocaleDateString()}</span>
                {post.published && <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-neutral-600 hover:text-white rounded transition-colors"><ExternalLink size={15}/></a>}
                <button onClick={() => handleEdit(post)} className="p-1.5 text-neutral-600 hover:text-white rounded transition-colors"><Edit2 size={15}/></button>
                <button onClick={() => handleDelete(post.id)} className="p-1.5 text-neutral-600 hover:text-red-400 rounded transition-colors"><Trash2 size={15}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
