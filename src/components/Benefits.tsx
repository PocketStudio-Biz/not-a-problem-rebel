
import { Brain, Mail, Zap, NotebookPen, Sparkles } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: <Mail className="h-7 w-7" />,
      title: "Daily Voice Memos",
      description: "Authentic, unfiltered conversations from one ND human to another"
    },
    {
      icon: <NotebookPen className="h-7 w-7" />,
      title: "Journal Prompts",
      description: "Reflection without the pressure to 'get it right'"
    },
    {
      icon: <Brain className="h-7 w-7" />,
      title: "Unmasking Actions",
      description: "Tiny, doable steps to reclaim your authentic self"
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Real Connection",
      description: "A space where you're truly heard, not fixed or analyzed"
    },
    {
      icon: <Sparkles className="h-7 w-7" />,
      title: "Optional Coaching",
      description: "A gentle invitation to go deeper on Day 5 (no pressure)"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {benefits.map((benefit, index) => (
        <div 
          key={index}
          className="flex items-start gap-3 p-4 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-soft-purple text-purple-700">
            {benefit.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Benefits;
