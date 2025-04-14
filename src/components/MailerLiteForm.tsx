
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const MailerLiteForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This is where you'd connect to MailerLite API
      // For demonstration, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      toast({
        title: "Thank you!",
        description: "You have successfully joined our subscriber list.",
        duration: 5000,
      });
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
      {!isSuccess ? (
        <div className="ml-form-embedWrapper bg-[#f6f6f6] rounded-lg p-5">
          {/* Header image */}
          <div className="ml-form-embedHeader mb-4">
            <img 
              src="https://storage.mlcdn.com/account_image/1451376/V7AB2KaSp8nq3FFSoszXnOdcHBlS5AFuC5MyNjde.png" 
              alt="Header" 
              className="w-full"
            />
          </div>
          
          {/* Form content */}
          <div className="ml-form-embedBody">
            <div className="ml-form-embedContent mb-6">
              <h4 className="text-2xl font-semibold text-black mb-4">Start the 5-Day Unmasking Challenge</h4>
              <p className="font-bold text-black">
                Sign up to get a daily email for 5 days to help you unmask, reconnect, and feel like yourself again.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="ml-form-fieldRow">
                <input
                  type="email"
                  aria-label="email"
                  aria-required="true"
                  className="w-full px-3 py-2 border border-[#cccccc] rounded-md bg-white text-[#333333]"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="ml-form-fieldRow">
                <input
                  type="text"
                  aria-label="name"
                  className="w-full px-3 py-2 border border-[#cccccc] rounded-md bg-white text-[#333333]"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="ml-form-embedSubmit">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-[#333333] text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin mr-2 h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Start the Challenge"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="ml-form-successBody bg-[#f6f6f6] rounded-lg p-5 text-center">
          <div className="ml-form-successContent">
            <h4 className="text-2xl font-semibold text-black mb-4">Thank you!</h4>
            <p className="text-black">You have successfully joined our subscriber list.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailerLiteForm;
