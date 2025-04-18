import React from "react";
import LandingPage from "@/components/LandingPage";

const LandingPageDemo = () => {
  const demoProps = {
    calendlyUrl: "https://calendly.com/mykey-pocket/connection-call"
  };

  return <LandingPage {...demoProps} />;
};

export default LandingPageDemo;
