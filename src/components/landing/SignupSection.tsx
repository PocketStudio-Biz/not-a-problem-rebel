import React from "react";
import NewsletterForm from "@/components/NewsletterForm";

interface SignupSectionProps {
  formRef: React.RefObject<HTMLDivElement>;
}

const SignupSection = ({ formRef }: SignupSectionProps) => (
  <section ref={formRef} className="my-16">
    <NewsletterForm />
  </section>
);

export default SignupSection;
