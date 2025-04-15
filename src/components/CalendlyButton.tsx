
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface CalendlyButtonProps {
  url: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

const CalendlyButton = ({ 
  url, 
  children, 
  variant = "default",
  className = ""
}: CalendlyButtonProps) => {
  // Default calendly URL for demonstration
  const calendlyUrl = url || "https://calendly.com";
  
  return (
    <Button
      asChild
      variant={variant}
      className={className}
    >
      <a 
        href={calendlyUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
      >
        <span>{children}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  );
};

export default CalendlyButton;
