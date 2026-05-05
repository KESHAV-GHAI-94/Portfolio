'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, MailOpen, Clock } from 'lucide-react';

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) setMessages(await res.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: number, read: boolean) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read }) });
    fetchMessages();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  };

  const open = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) markRead(msg.id, true);
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6 flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Inbox</h1>
          <p className="text-neutral-500 text-sm mt-1">Contact form submissions.</p>
        </div>
        {unread > 0 && (
          <span className="text-xs font-medium text-white border border-neutral-700 px-3 py-1 rounded-full">{unread} unread</span>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 overflow-hidden min-h-0">
        {/* List */}
        <div className="border border-neutral-800 rounded-xl overflow-y-auto flex flex-col col-span-1">
          {loading ? (
            <p className="p-6 text-neutral-500 text-sm">Loading…</p>
          ) : messages.length === 0 ? (
            <p className="p-6 text-neutral-500 text-sm text-center">No messages yet.</p>
          ) : (
            <div className="divide-y divide-neutral-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => open(msg)}
                  className={`px-4 py-4 cursor-pointer transition-colors border-l-2 ${
                    selected?.id === msg.id ? 'border-white bg-neutral-950' : msg.read ? 'border-transparent hover:bg-neutral-950' : 'border-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm truncate pr-2 ${!msg.read ? 'text-white font-semibold' : 'text-neutral-400'}`}>{msg.name}</span>
                    {!msg.read && <span className="w-1.5 h-1.5 bg-white rounded-full shrink-0 mt-1.5"/>}
                  </div>
                  <p className="text-xs text-neutral-600 mb-1 truncate">{msg.email}</p>
                  <p className="text-xs text-neutral-600 line-clamp-2">{msg.message}</p>
                  <div className="flex items-center text-xs text-neutral-700 mt-2"><Clock size={10} className="mr-1"/>{new Date(msg.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="md:col-span-2 border border-neutral-800 rounded-xl overflow-y-auto flex flex-col">
          {selected ? (
            <div className="p-7 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6 pb-5 border-b border-neutral-900">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-neutral-500 hover:text-white text-sm transition-colors">{selected.email}</a>
                  <div className="flex items-center text-xs text-neutral-700 mt-2"><Clock size={11} className="mr-1"/>{new Date(selected.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => markRead(selected.id, !selected.read)} className="p-2 text-neutral-600 hover:text-white rounded transition-colors" title={selected.read ? 'Mark unread' : 'Mark read'}>
                    {selected.read ? <Mail size={16}/> : <MailOpen size={16}/>}
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="p-2 text-neutral-600 hover:text-red-400 rounded transition-colors" title="Delete">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
              <p className="flex-1 text-neutral-300 whitespace-pre-wrap leading-relaxed text-sm font-light">{selected.message}</p>
              <div className="mt-6 pt-5 border-t border-neutral-900">
                <a href={`mailto:${selected.email}?subject=Re: Your message`} className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-200 text-black px-5 py-2.5 rounded-md text-sm font-medium transition-colors">
                  <Mail size={15}/><span>Reply via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-700 p-8 text-center">
              <MailOpen size={40} className="mb-3 opacity-30"/>
              <p className="text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
