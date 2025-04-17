
import React from 'react';

const WhatToExpect = () => {
  return (
    <section className="mb-24" aria-labelledby="what-to-expect-heading">
      <h2 id="what-to-expect-heading" className="text-3xl font-bold text-center mb-12">What to Expect</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="font-bold text-xl mb-3">Who is this for?</h3>
          <p className="text-gray-800">
            Neurodivergent souls who are tired of being told they're a 
            problem to fix. People who want to shed their masks and live 
            authentically. Anyone seeking connection without performative 
            wellness culture.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="font-bold text-xl mb-3">How does it work?</h3>
          <p className="text-gray-800">
            For 5 days, you'll receive daily emails with voice memos, 
            journal prompts, and tiny unmasking actions. Everything is 
            optional - take what serves you and leave the rest. On day 5, 
            there's a soft invitation to a 1:1 session.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatToExpect;
