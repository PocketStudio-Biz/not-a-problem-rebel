
import React from 'react';

const Features = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16" role="list">
      <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
          <span className="text-2xl" role="img" aria-label="Envelope">💌</span>
        </div>
        <h3 className="font-bold text-xl mb-2">Daily Voice Memos</h3>
        <p className="text-gray-800">
          Authentic, unfiltered conversation from one ND human to another
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
          <span className="text-2xl" role="img" aria-label="Writing hand">✍️</span>
        </div>
        <h3 className="font-bold text-xl mb-2">Journal Prompts</h3>
        <p className="text-gray-800">
          Reflection without the pressure to 'get it right'
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm" role="listitem">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
          <span className="text-2xl" role="img" aria-label="Brain">🧠</span>
        </div>
        <h3 className="font-bold text-xl mb-2">Unmasking Actions</h3>
        <p className="text-gray-800">
          Tiny, doable steps to reclaim your authentic self
        </p>
      </div>
    </div>
  );
};

export default Features;
