'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm({ email, isModal = false }: { email?: string; isModal?: boolean }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validateEmail = (email: string) => {
    // Enhanced regex for real email addresses
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!re.test(email)) return false;
    
    // Additional "real email" checks
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const domain = parts[1];
    // Must have at least one dot and a TLD of at least 2 characters
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;
    if (domainParts[domainParts.length - 1].length < 2) return false;
    
    // Check for common typos/spam patterns (optional but makes it "fuller")
    const commonDisposable = ['test.com', 'example.com', 'tempmail.com', 'mailinator.com'];
    if (commonDisposable.includes(domain.toLowerCase())) return false;

    return true;
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Name is required';
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
    } else if (name === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!validateEmail(value)) error = 'Please enter a valid "real" email address';
    } else if (name === 'message') {
      if (!value.trim()) error = 'Message is required';
      else if (value.trim().length < 10) error = 'Message must be at least 10 characters';
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // For immediate feedback while typing
    const error = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    const error = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    };
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.values(newErrors).some(err => err !== '')) {
      return;
    }

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
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-8 py-5 bg-foreground/5 border ${touched.name && errors.name ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30' : 'border-border focus:border-foreground/30 focus:ring-foreground/30'} rounded-full focus:outline-none focus:ring-1 transition-all text-foreground placeholder-muted/40 font-light`}
                  placeholder="John Doe"
                />
                {touched.name && errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[11px] text-red-500/80 px-6 font-medium"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-muted/60 px-6">Email</label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-8 py-5 bg-foreground/5 border ${
                      touched.email && errors.email 
                        ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30' 
                        : touched.email && !errors.email && formData.email
                          ? 'border-green-500/50 focus:border-green-500/70 focus:ring-green-500/30'
                          : 'border-border focus:border-foreground/30 focus:ring-foreground/30'
                    } rounded-full focus:outline-none focus:ring-1 transition-all text-foreground placeholder-muted/40 font-light`}
                    placeholder="john@example.com"
                  />
                  {touched.email && !errors.email && formData.email && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute right-6 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500/80" />
                    </motion.div>
                  )}
                </div>
                {touched.email && errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[11px] text-red-500/80 px-6 font-medium"
                  >
                    {errors.email}
                  </motion.p>
                )}
                {touched.email && !errors.email && formData.email && (
                  <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[11px] text-green-500/80 px-6 font-medium"
                  >
                    Email looks good!
                  </motion.p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-[10px] uppercase tracking-widest font-bold text-muted/60 px-6">Message</label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-8 py-8 bg-foreground/5 border ${touched.message && errors.message ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30' : 'border-border focus:border-foreground/30 focus:ring-foreground/30'} rounded-[2rem] focus:outline-none focus:ring-1 transition-all text-foreground placeholder-muted/40 font-light resize-none`}
                placeholder="Tell me about your project..."
              />
              {touched.message && errors.message && (
                <motion.p 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[11px] text-red-500/80 px-6 font-medium"
                >
                  {errors.message}
                </motion.p>
              )}
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
