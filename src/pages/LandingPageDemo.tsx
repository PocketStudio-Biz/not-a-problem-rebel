
import React from "react";
import LandingPage from "@/components/LandingPage";

const LandingPageDemo = () => {
  // Demo props for the LandingPage component
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
      src: "", // Leave empty to test fallback
      alt: "Alex Taylor",
      size: "large" as const,
    },
    // Uncomment to test error states
    // hasError: {
    //   email: true,
    //   name: false,
    //   calendlyLink: {
    //     url: true,
    //     label: false,
    //   },
    //   calendlySessionButton: {
    //     type: false,
    //   },
    // },
  };

  return <LandingPage {...demoProps} />;
};

export default LandingPageDemo;
