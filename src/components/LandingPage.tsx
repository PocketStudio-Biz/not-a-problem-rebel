
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import Benefits from "@/components/Benefits";
import SignupForm from "@/components/SignupForm";

// Types for the component props
interface ProfileImageProps {
  src: string;
  alt: string;
  size: "large" | "small";
}

interface CalendlyLinkProps {
  url: string;
  label: string;
  type: "button";
}

interface CalendlySessionButtonProps {
  type: "button";
}

interface ErrorProps {
  email?: boolean;
  name?: boolean;
  calendlyLink?: {
    url?: boolean;
    label?: boolean;
  };
  calendlySessionButton?: {
    type?: boolean;
  };
}

interface LandingPageProps {
  email: string;
  name: string;
  calendlyLink: CalendlyLinkProps;
  calendlySessionButton: CalendlySessionButtonProps;
  profileImage: ProfileImageProps;
  hasError?: ErrorProps;
}

const LandingPage: React.FC<LandingPageProps> = ({
  email,
  name,
  calendlyLink,
  calendlySessionButton,
  profileImage,
  hasError = {},
}) => {
  // Validate required props
  const errors = {
    email: !email || hasError.email,
    name: !name || hasError.name,
    calendlyLink: {
      url: !calendlyLink.url || (hasError.calendlyLink?.url ?? false),
      label: !calendlyLink.label || (hasError.calendlyLink?.label ?? false),
    },
    calendlySessionButton: {
      type: calendlySessionButton.type !== "button" || (hasError.calendlySessionButton?.type ?? false),
    },
  };

  const hasAnyError = 
    errors.email || 
    errors.name || 
    errors.calendlyLink.url || 
    errors.calendlyLink.label || 
    errors.calendlySessionButton.type;

  // Profile image size classes
  const profileImageClasses = {
    large: "w-48 h-48 md:w-56 md:h-56",
    small: "w-32 h-32 md:w-40 md:h-40",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-warm-gradient font-nunito relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-soft-yellow rounded-full opacity-30 blur-3xl -z-10"></div>
      <div className="absolute bottom-[-100px] left-[-50px] w-96 h-96 bg-soft-pink rounded-full opacity-30 blur-3xl -z-10"></div>
      
      <main className="container max-w-5xl px-4 py-8 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            You were never broken.
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Join 5 days of unmasking, tiny actions, and being heard.
          </p>
        </header>

        {hasAnyError && (
          <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
            <h2 className="text-lg font-bold text-red-700 mb-2">Please fix the following errors:</h2>
            <ul className="list-disc pl-5 text-red-600">
              {errors.email && (
                <li>Email is required</li>
              )}
              {errors.name && (
                <li>Name is required</li>
              )}
              {errors.calendlyLink.url && (
                <li>Calendly link URL is required</li>
              )}
              {errors.calendlyLink.label && (
                <li>Calendly link label is required</li>
              )}
              {errors.calendlySessionButton.type && (
                <li>Calendly session button type must be "button"</li>
              )}
            </ul>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                I'm Not a Problem to Solve
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                A free 5-day email challenge for neurodivergent rebels who are done masking 
                and ready to feel heard. No fixing. No PDFs. No webinars. 
                Just realness in your inbox.
              </p>
              
              <div className="mb-8">
                <Benefits />
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex flex-col items-center">
            {/* Profile image with Avatar from shadcn/ui */}
            <div className="mb-6">
              <Avatar className={`rounded-full overflow-hidden border-4 border-white shadow-xl ${profileImageClasses[profileImage.size]}`}>
                {profileImage.src ? (
                  <AvatarImage src={profileImage.src} alt={profileImage.alt} />
                ) : (
                  <AvatarFallback className="bg-soft-green text-gray-600 text-2xl">
                    {getInitials(name || "Profile")}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            
            {/* Displaying the user's info in the form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Name</label>
                    <p className={`p-2 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50' : 'border-soft-gray'}`}>
                      {name || <span className="text-red-500">Please enter your name</span>}
                    </p>
                    {errors.name && <p className="text-sm text-red-500">Name is required</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Email</label>
                    <p className={`p-2 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-soft-gray'}`}>
                      {email || <span className="text-red-500">Please enter your email</span>}
                    </p>
                    {errors.email && <p className="text-sm text-red-500">Email is required</p>}
                  </div>
                  
                  <Button 
                    className="w-full bg-warm-gradient hover:bg-warm-gradient-hover text-black font-bold h-12 text-lg rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    Join the Challenge →
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500">
                    No fixing. No performing. Just realness in your inbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 md:mt-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            What to Expect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-xl mb-2">Who is this for?</h3>
              <p className="text-gray-700">
                Neurodivergent souls who are tired of being told they're a problem to fix. 
                People who want to shed their masks and live authentically. Anyone seeking 
                connection without performative wellness culture.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-xl mb-2">How does it work?</h3>
              <p className="text-gray-700">
                For 5 days, you'll receive daily emails with voice memos, journal prompts, 
                and tiny unmasking actions. Everything is optional - take what serves you 
                and leave the rest.
              </p>
            </div>
          </div>
        </section>

        {/* Call-to-action with Calendly */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready for deeper support?
          </h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            After the 5-day challenge, you'll have the option to book a 1:1 session.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="bg-warm-gradient hover:bg-warm-gradient-hover text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              <a 
                href={calendlyLink.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${errors.calendlyLink.url ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <span>{calendlyLink.label || "Book a Call"}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            
            {(errors.calendlyLink.url || errors.calendlyLink.label) && (
              <p className="text-sm text-red-500">Valid Calendly link information is required</p>
            )}
          </div>
          
          {errors.calendlySessionButton.type && (
            <p className="text-sm text-red-500 mt-2">Calendly session button type must be "button"</p>
          )}
        </section>
      </main>

      <footer className="bg-white/30 backdrop-blur-sm py-8 mt-16">
        <div className="container max-w-5xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} I'm Not a Problem to Solve
            </p>
            
            <div className="flex items-center gap-4">
              <Button 
                asChild
                variant="ghost"
                className="text-gray-700 hover:text-black transition-colors"
              >
                <a 
                  href={calendlyLink.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span>{calendlyLink.label}</span>
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
