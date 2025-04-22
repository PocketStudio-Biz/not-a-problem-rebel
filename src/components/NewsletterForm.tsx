import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewsletterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const name = formData.get("name") as string;

      // Debug info
      console.log("Form data:", { email, name });
      console.log(
        "Anon key present:",
        !!import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const response = await fetch(
        "https://qsevudeuwedgofdwemsc.supabase.co/functions/v1/mailerlite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, name }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error("API Error:", data);
        throw new Error(
          data.error || `Failed to subscribe (${response.status})`
        );
      }

      const data = await response.json();
      console.log("Success response:", data);
      alert("Welcome aboard! Check your email for updates.");
      e.currentTarget.reset();
    } catch (error: any) {
      console.error("Subscription error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl">
      <h3 className="text-2xl font-bold mb-4 text-center">
        Join the Challenge
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Your name"
          name="name"
          disabled={isSubmitting}
          required
        />
        <Input
          type="email"
          placeholder="Your email"
          name="email"
          required
          disabled={isSubmitting}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Start Unmasking →"}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterForm;
