import React, { useEffect } from "react";

declare global {
  interface Window {
    ml: Function;
  }
}

const NewsletterForm = () => {
  useEffect(() => {
    // Ensure the MailerLite script has loaded
    if (window.ml) {
      window.ml("embedded", "LQG1Qn");
    }
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl">
      <h3 className="text-2xl font-bold mb-4 text-center">
        Join the Challenge
      </h3>
      <p className="text-center mb-6">
        5 days of voice memos, journal prompts & tiny actions to help you unmask
        and feel like yourself again.
      </p>
      <div className="ml-embedded" data-form="LQG1Qn"></div>
    </div>
  );
};

export default NewsletterForm;
