'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm({ email, isModal = false }: { email?: string; isModal?: boolean }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  const formContent = (
    <div className={`${isModal ? '' : 'container mx-auto px-8 md:px-12 max-w-4xl relative z-10'}`}>
      {!isModal && (
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2 text-gradient inline-block">Contact</h2>
          <p className="text-muted">
            Let's build something together. {email && <span>You can reach me directly at <a href={`mailto:${email}`} className="text-foreground hover:underline">{email}</a> or use the form below.</span>}
          </p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 rounded-2xl glass-panel">
            <CheckCircle className="w-12 h-12 text-foreground" />
            <h3 className="text-xl font-medium text-foreground">Message Sent</h3>
            <p className="text-muted">Thanks for reaching out. I'll get back to you shortly.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 px-8 py-3 bg-foreground text-background hover:opacity-90 rounded-full transition-all text-sm font-medium shadow-lg shadow-foreground/10"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold text-muted/60 px-6">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-8 py-5 bg-foreground/5 border border-border rounded-full focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 transition-all text-foreground placeholder-muted/40 font-light"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-muted/60 px-6">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-8 py-5 bg-foreground/5 border border-border rounded-full focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 transition-all text-foreground placeholder-muted/40 font-light"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-[10px] uppercase tracking-widest font-bold text-muted/60 px-6">Message</label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-8 py-8 bg-foreground/5 border border-border rounded-[2rem] focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 transition-all text-foreground placeholder-muted/40 font-light resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center space-x-2 text-foreground text-sm bg-red-900/10 border border-red-500/20 p-4 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>Something went wrong. Please try again later.</span>
              </div>
            )}

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="group flex justify-center items-center space-x-4 bg-foreground text-background px-16 py-5 rounded-full font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-foreground/10"
              >
                <span className="text-xs uppercase tracking-[0.3em]">{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                {status !== 'loading' && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <section id="contact" className="py-40 relative bg-background scroll-mt-24 transition-colors duration-500">
      <div className="section-divider absolute top-0 left-0" />
      {formContent}
    </section>
  );
}
