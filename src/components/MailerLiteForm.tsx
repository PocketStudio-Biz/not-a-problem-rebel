
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MailerLiteForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to join the challenge.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // For demo purposes, we'll simulate a successful API call
      // In production, you would uncomment the actual API call to MailerLite
      
      /* 
      const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer YOUR_MAILERLITE_API_KEY`, 
        },
        body: JSON.stringify({
          email: email,
          fields: {
            name: name
          },
          groups: ["YOUR_GROUP_ID"],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to subscribe");
      }
      */
      
      // This is for demo purposes - remove in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast({
        title: "Welcome to the challenge!",
        description: "Check your inbox for your first unmasking action.",
        duration: 5000,
      });
      
      // Clear form
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!isSuccess ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold mb-3">Join the 5-Day Challenge</h3>
            <p className="text-gray-700">
              No fixing. No performative wellness. Just realness in your inbox.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border-soft-gray focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
              />
            </div>
            
            <div>
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border-soft-gray focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-300 to-pink-300 hover:from-amber-400 hover:to-pink-400 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 h-auto text-lg"
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-4 border-black border-t-transparent rounded-full"></div>
                  <span>Joining...</span>
                </div>
              ) : (
                "Start Unmasking →"
              )}
            </Button>
            
            <p className="text-center text-sm text-gray-500 italic">
              5 days of voice memos, journal prompts & tiny actions
            </p>
          </form>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center animate-fade-in">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">You're in!</h3>
          <p className="text-gray-700 mb-4">
            Check your inbox for your first unmasking action. Can't wait to connect with you!
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="text-black border-black hover:bg-gray-100"
          >
            Back to form
          </Button>
        </div>
      )}
    </div>
  );
};

export default MailerLiteForm;
