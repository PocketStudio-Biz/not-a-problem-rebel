
import React from 'react';

const ChallengeContent = () => {
  return (
    <section className="mb-24" aria-labelledby="whats-inside-heading">
      <h2 id="whats-inside-heading" className="text-3xl font-bold text-center mb-12">What's Inside</h2>
      <div className="grid md:grid-cols-3 gap-8" role="list">
        <div className="bg-white rounded-xl p-6 text-center shadow-sm" role="listitem">
          <div className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
            <span role="img" aria-label="Mailbox">📬</span>
          </div>
          <h3 className="font-bold text-xl mb-3">Daily Voice Memos</h3>
          <p className="text-gray-800">
            Raw, unfiltered, and real conversations about unmasking and 
            embracing your neurodivergence.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 text-center shadow-sm" role="listitem">
          <div className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
            <span role="img" aria-label="Brain">🧠</span>
          </div>
          <h3 className="font-bold text-xl mb-3">Journal Prompts</h3>
          <p className="text-gray-800">
            Deep, reflective questions that help you reconnect with yourself 
            and honor your unique mind.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 text-center shadow-sm" role="listitem">
          <div className="w-12 h-12 mx-auto mb-4" aria-hidden="true">
            <span role="img" aria-label="Lightning bolt">⚡</span>
          </div>
          <h3 className="font-bold text-xl mb-3">Tiny Actions</h3>
          <p className="text-gray-800">
            Simple, doable steps to practice unmasking in your everyday life, 
            at your own pace.
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mt-12" role="list">
        <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
            <span className="text-2xl" role="img" aria-label="Lightning bolt">⚡</span>
          </div>
          <h3 className="font-bold text-xl mb-2">Real Connection</h3>
          <p className="text-gray-800">
            A space where you're truly heard, not fixed or analyzed
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
            <span className="text-2xl" role="img" aria-label="Sparkles">✨</span>
          </div>
          <h3 className="font-bold text-xl mb-2">Optional Coaching</h3>
          <p className="text-gray-800">
            A gentle invitation to go deeper on Day 5 (no pressure)
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChallengeContent;
