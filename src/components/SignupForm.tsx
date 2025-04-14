
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This is where you'd connect to MailerLite API
      // For now we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "You're in!",
        description: "Check your inbox for Day 1 of your unmasking journey.",
        duration: 5000,
      });
      
      setName("");
      setEmail("");
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-4 bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-lg"
      >
        <div className="space-y-2">
          <Input
            type="text"
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border-soft-gray h-12 text-lg placeholder:text-gray-400"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Input
            type="email"
            id="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-soft-gray h-12 text-lg placeholder:text-gray-400"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-warm-gradient hover:bg-warm-gradient-hover text-black font-bold h-12 text-lg rounded-xl transition-all duration-300 hover:shadow-lg"
        >
          {isSubmitting ? "Signing up..." : "Join the Challenge →"}
        </Button>
        
        <p className="text-center text-sm text-gray-500">
          No fixing. No performing. Just realness in your inbox.
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
