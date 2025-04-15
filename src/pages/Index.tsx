
import SignupForm from "@/components/SignupForm";
import Benefits from "@/components/Benefits";
import { ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-50 font-nunito relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-amber-200 rounded-full opacity-30 blur-3xl -z-10"></div>
      <div className="absolute bottom-[-100px] left-[-50px] w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl -z-10"></div>
      
      <main className="container max-w-5xl px-4 py-8 md:py-16">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            You were never broken.
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Join 5 days of unmasking, tiny actions, and being heard.
          </p>
        </header>

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
            {/* Profile image placeholder - replace with your actual image */}
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl bg-gradient-to-br from-amber-200 to-pink-200 flex items-center justify-center">
              <span className="text-center text-gray-600 p-4">
                Your profile image here
              </span>
            </div>
            
            <SignupForm />
          </div>
        </div>

        {/* What's Inside Section */}
        <section className="mt-16 md:mt-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            What's Inside
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="text-3xl mb-3">💌</div>
              <h3 className="font-bold text-xl mb-2">Daily Voice Memos</h3>
              <p className="text-gray-700">
                Raw, unfiltered, and real conversations about unmasking and embracing your neurodivergence.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-bold text-xl mb-2">Journal Prompts</h3>
              <p className="text-gray-700">
                Deep, reflective questions that help you reconnect with yourself and honor your unique mind.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-xl mb-2">Tiny Actions</h3>
              <p className="text-gray-700">
                Simple, doable steps to practice unmasking in your everyday life, at your own pace.
              </p>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="mt-16 md:mt-20">
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
                and leave the rest. On day 5, there's a soft invitation to a 1:1 session.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky CTA that appears when scrolling */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 shadow-lg transition-transform duration-300 ${
          hasScrolled ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="container max-w-5xl px-4 flex items-center justify-between">
          <p className="font-bold text-sm md:text-base">Ready to unmask?</p>
          <a 
            href="#top" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
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
              <a 
                href="https://calendly.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-700 hover:text-black transition-colors"
              >
                <span>Book a Call</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
