
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a subscriber entry in Supabase
      const { error } = await supabase
        .from('subscribers')
        .insert([{ name, email }]);

      if (error) throw error;

      // Here we would typically also make a request to MailerLite API
      // But we're storing in Supabase first for tracking

      toast.success("You're in! Check your inbox soon.", {
        description: "Thank you for joining the challenge.",
      });
      
      // Reset form
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Something went wrong", { 
        description: "Please try again or reach out directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 max-w-3xl">
        {/* Hero section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-purple-900 tracking-tighter">
            You were never broken.
          </h1>
          <p className="text-xl md:text-2xl text-purple-700 mb-8">
            Join 5 days of unmasking, tiny actions, and being heard.
          </p>
          <div className="w-32 h-32 rounded-full bg-purple-200 mx-auto mb-8 overflow-hidden">
            {/* Placeholder for profile image */}
            <div className="w-full h-full flex items-center justify-center text-purple-500">
              Profile Image
            </div>
          </div>
        </section>

        {/* What's inside section */}
        <section className="mb-16 bg-white/70 rounded-xl p-6 backdrop-blur-sm shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">What's inside:</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4">
              <div className="text-4xl mb-2">💌</div>
              <h3 className="font-medium text-lg mb-1">Daily Voice Memos</h3>
              <p className="text-purple-600">Raw, unfiltered wisdom in your inbox for 5 days</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="text-4xl mb-2">🧠</div>
              <h3 className="font-medium text-lg mb-1">Journal Prompts</h3>
              <p className="text-purple-600">Thought-provoking questions to deepen your unmasking</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-medium text-lg mb-1">Tiny Actions</h3>
              <p className="text-purple-600">Simple steps to practice being your authentic self</p>
            </div>
          </div>
        </section>

        {/* Signup form */}
        <section className="max-w-md mx-auto bg-white/90 rounded-xl p-8 backdrop-blur-sm shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">Ready to unmask?</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-purple-200 focus:border-purple-500"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-purple-200 focus:border-purple-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? "Joining..." : "Join the Challenge"}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
              No fixing. No performative activism. Just realness in your inbox.
            </p>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-purple-900/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-purple-700 mb-2">© 2025 I'm Not a Problem to Solve</p>
          <a 
            href="https://calendly.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-purple-600 hover:text-purple-800 underline text-sm"
          >
            Book a 1:1 Session
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
