
import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '@/components/SignupForm';
import { Calendar, Heart, Sparkles } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-pink-100 font-nunito">
      {/* Header with soft fade-in */}
      <header className="pt-10 pb-6 px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800 leading-tight">
          You were never broken.
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Join 5 days of unmasking, tiny actions, and being heard.
        </h2>
      </header>

      {/* Main content */}
      <main className="px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center py-8">
          {/* Left column - Profile and challenge info */}
          <div className="space-y-8">
            {/* Profile image */}
            <div className="relative mx-auto md:mx-0 max-w-xs">
              <div className="bg-white p-2 rounded-full shadow-md inline-block mb-4">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-inner mx-auto">
                  <img 
                    src="/not-a-problem-sweatshirt.png" 
                    alt="Person wearing a 'not a problem to solve' sweatshirt" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Challenge details */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">What's inside this 5-day challenge:</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center text-xl">
                    💌
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Daily Voice Memos</h4>
                    <p className="text-gray-600">Raw, unfiltered messages that validate your experience of being neurodivergent in a neurotypical world.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center text-xl">
                    🧠
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Journal Prompts</h4>
                    <p className="text-gray-600">Reflective questions that invite you to connect with your authentic ND self.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Tiny Unmasking Actions</h4>
                    <p className="text-gray-600">Small, doable steps to practice showing up as your full ND self.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Signup form */}
          <div className="md:mt-0 mt-8">
            <SignupForm />
          </div>
        </div>

        {/* Manifesto section */}
        <div className="my-16 max-w-3xl mx-auto text-center space-y-4 px-4">
          <h3 className="text-2xl font-bold">This is not about fixing you.</h3>
          <p className="text-lg text-gray-700">
            No PDFs. No webinars. No performance. No "strategies to manage yourself better."
            Just realness in your inbox and permission to be exactly who you are.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-600 bg-white/30">
        <div className="max-w-5xl mx-auto px-4">
          <p className="mb-4">© 2025 I'm Not a Problem to Solve</p>
          <div className="flex justify-center gap-6">
            <Link to="https://calendly.com" className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors">
              <Calendar size={16} />
              <span>Book a call</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
