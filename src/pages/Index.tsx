
import React, { useState, useEffect } from "react";
import SignupForm from "@/components/SignupForm";
import Benefits from "@/components/Benefits";
import ProfileImage from "@/components/ProfileImage";
import CalendlyButton from "@/components/CalendlyButton";
import { ExternalLink } from "lucide-react";

const Index = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setHasScrolled(offset > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For demo purposes, you can replace this with an actual Calendly URL
  const calendlyUrl = "https://calendly.com/example/coaching";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-50 font-nunito relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-amber-200 rounded-full opacity-30 blur-3xl -z-10"></div>
      <div className="absolute bottom-[-100px] left-[-50px] w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl -z-10"></div>
      
      <main className="container max-w-5xl px-4 py-8 md:py-16" id="top">
        <header className="text-center mb-12 md:mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-gray-800">
            You were never broken.
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Join 5 days of unmasking, tiny actions, and being heard.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                I'm Not a Problem to Solve
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                A free 5-day email challenge for neurodivergent rebels who are done masking 
                and ready to feel heard. No fixing. No PDFs. No webinars. 
                Just realness in your inbox.
              </p>
              
              <div className="mb-8">
                <Benefits />
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex flex-col items-center animate-fade-in" style={{ animationDelay: "300ms" }}>
            {/* Profile image with hover effect */}
            <div className="mb-6">
              <ProfileImage 
                src="" 
                alt="Challenge Creator" 
                fallback="ND"
                size="large"
              />
            </div>
            
            <SignupForm />
          </div>
        </div>

        {/* What's Inside Section */}
        <section className="mt-16 md:mt-24 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
            What's Inside
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300">
              <div className="text-3xl mb-3">💌</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Daily Voice Memos</h3>
              <p className="text-gray-700">
                Raw, unfiltered, and real conversations about unmasking and embracing your neurodivergence.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Journal Prompts</h3>
              <p className="text-gray-700">
                Deep, reflective questions that help you reconnect with yourself and honor your unique mind.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Tiny Actions</h3>
              <p className="text-gray-700">
                Simple, doable steps to practice unmasking in your everyday life, at your own pace.
              </p>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="mt-16 md:mt-20 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
            What to Expect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="font-bold text-xl mb-2 text-gray-800">Who is this for?</h3>
              <p className="text-gray-700 leading-relaxed">
                Neurodivergent souls who are tired of being told they're a problem to fix. 
                People who want to shed their masks and live authentically. Anyone seeking 
                connection without performative wellness culture.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="font-bold text-xl mb-2 text-gray-800">How does it work?</h3>
              <p className="text-gray-700 leading-relaxed">
                For 5 days, you'll receive daily emails with voice memos, journal prompts, 
                and tiny unmasking actions. Everything is optional - take what serves you 
                and leave the rest. On day 5, there's a soft invitation to a 1:1 session.
              </p>
            </div>
          </div>
        </section>

        {/* Calendly Call-to-action */}
        <section className="mt-16 text-center p-8 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm animate-fade-in" style={{ animationDelay: "600ms" }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Ready for deeper support?
          </h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
            After the 5-day challenge, you'll have the option to book a 1:1 coaching session to 
            explore your unique neurodivergent experience in a space that truly gets you.
          </p>
          
          <CalendlyButton 
            url={calendlyUrl}
            className="bg-gradient-to-r from-amber-300 to-pink-300 hover:from-amber-400 hover:to-pink-400 text-black font-bold px-6 py-4 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            Book a Free Session
          </CalendlyButton>
        </section>
      </main>

      {/* Sticky CTA that appears when scrolling */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 shadow-lg transition-transform duration-300 ${hasScrolled ? "translate-y-0" : "translate-y-full"}`}>
        <div className="container max-w-5xl px-4 flex items-center justify-between">
          <p className="font-bold text-sm md:text-base text-gray-800">Ready to unmask?</p>
          <a 
            href="#top" 
            onClick={e => {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }} 
            className="bg-gradient-to-r from-amber-300 to-pink-300 hover:from-amber-400 hover:to-pink-400 text-black font-bold px-4 py-2 rounded-lg text-sm md:text-base transition-all"
          >
            Join the Challenge →
          </a>
        </div>
      </div>

      <footer className="bg-white/30 backdrop-blur-sm py-8 mt-16">
        <div className="container max-w-5xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} I'm Not a Problem to Solve
            </p>
            
            <div className="flex items-center gap-4">
              <CalendlyButton
                url={calendlyUrl}
                variant="ghost"
                className="text-gray-700 hover:text-black transition-colors text-sm"
              >
                Book a Session
              </CalendlyButton>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
