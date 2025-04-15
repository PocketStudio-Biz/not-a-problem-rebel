
import React from "react";
import LandingPage from "@/components/LandingPage";

const LandingPageDemo = () => {
  const demoProps = {
    name: "Alex Taylor",
    email: "alex@example.com",
    calendlyLink: {
      url: "https://calendly.com/demo-link",
      label: "Book a Session",
      type: "button" as const,
    },
    calendlySessionButton: {
      type: "button" as const,
    },
    profileImage: {
      src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      alt: "Profile Picture",
      size: "large" as const,
    },
  };

  return <LandingPage {...demoProps} />;
};

export default LandingPageDemo;
