import React from 'react';

interface HeaderProps {
  scrollToForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ scrollToForm }) => {
  return (
    <>
      {/* Header */}
      <header className="text-center mb-12" role="banner">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
          You were never broken.
        </h1>
        <p className="text-xl text-gray-800">
          Join 5 days of unmasking, tiny actions, and being heard.
        </p>
        <button 
          onClick={scrollToForm}
          className="mt-8 gradient-button"
          aria-label="Go to challenge signup form"
        >
          Join the Challenge →
        </button>
      </header>

      {/* Subtitle */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">I'm Not a Problem to Solve</h2>
        <p className="text-gray-800 max-w-2xl mx-auto">
          A free 5-day email challenge for neurodivergent rebels who 
          are done masking and ready to feel heard. No fixing. No 
          PDFs. No webinars. Just realness in your inbox.
        </p>
      </div>
    </>
  );
};

export default Header;
