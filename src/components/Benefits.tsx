import { Mail, NotebookPen, Brain, Zap, Sparkles } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: <NotebookPen className="h-7 w-7 text-purple-600" />,
      title: "Journal Prompts",
      description: "Gentle invitations to explore, not assignments to perfect"
    },
    {
      icon: <Brain className="h-7 w-7 text-purple-600" />,
      title: "Unmasking Actions",
      description: "Tiny rebellions that honor your authentic self"
    },
    {
      icon: <Sparkles className="h-7 w-7 text-purple-600" />,
      title: "Optional Support",
      description: "A soft landing if you want to go deeper (zero pressure)"
    },
    {
      icon: <Mail className="h-7 w-7 text-purple-600" />,
      title: "Daily Voice Notes",
      description: "Real talk from one neurodivergent human to another. No filters, no performing."
    },
    {
      icon: <Zap className="h-7 w-7 text-purple-600" />,
      title: "True Connection",
      description: "A space to be beautifully, messily you. No fixing needed."
    }
  ];

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      {/* Top row - 3 cards */}
      <div className="grid grid-cols-3 gap-4">
        {benefits.slice(0, 3).map((benefit, index) => (
          <div 
            key={index}
            className="flex flex-col p-5 rounded-2xl bg-white shadow-sm"
          >
            <div className="mb-3">
              <div className="inline-block p-3 rounded-full bg-purple-100/80">
                {benefit.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600 text-sm">{benefit.description}</p>
          </div>
        ))}
      </div>
      
      {/* Bottom row - 2 cards */}
      <div className="grid grid-cols-2 gap-4">
        {benefits.slice(3, 5).map((benefit, index) => (
          <div 
            key={index + 3}
            className="flex flex-col p-5 rounded-2xl bg-white shadow-sm"
          >
            <div className="mb-3">
              <div className="inline-block p-3 rounded-full bg-purple-100/80">
                {benefit.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600 text-sm">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
