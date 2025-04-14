
import { Mail, NotebookPen, Brain, Zap, Sparkles } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: <Mail className="h-7 w-7 text-purple-600" />,
      title: "Daily Voice Memos",
      description: "Authentic, unfiltered conversation from one ND human to another"
    },
    {
      icon: <NotebookPen className="h-7 w-7 text-purple-600" />,
      title: "Journal Prompts",
      description: "Reflection without the pressure to 'get it right'"
    },
    {
      icon: <Brain className="h-7 w-7 text-purple-600" />,
      title: "Unmasking Actions",
      description: "Tiny, doable steps to reclaim your authentic self"
    },
    {
      icon: <Zap className="h-7 w-7 text-purple-600" />,
      title: "Real Connection",
      description: "A space where you're truly heard, not fixed or analyzed"
    },
    {
      icon: <Sparkles className="h-7 w-7 text-purple-600" />,
      title: "Optional Coaching",
      description: "A gentle invitation to go deeper on Day 5 (no pressure)"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {benefits.map((benefit, index) => (
        <div 
          key={index}
          className="flex flex-col items-start gap-3 p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="mb-2 p-3 rounded-full bg-purple-100">
            {benefit.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Benefits;
