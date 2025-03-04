
import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = "primary", 
    size = "md", 
    isLoading = false, 
    icon, 
    iconPosition = "left",
    asChild = false,
    ...props 
  }, ref) => {
    // Base styles
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foodz-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    // Variant styles
    const variantStyles = {
      primary: "bg-foodz-500 text-white hover:bg-foodz-600 shadow-sm active:scale-[0.98]",
      secondary: "bg-foodz-100 text-foodz-900 hover:bg-foodz-200 active:scale-[0.98]",
      outline: "border border-foodz-200 bg-transparent hover:bg-foodz-50 text-foodz-800",
      ghost: "bg-transparent hover:bg-foodz-50 text-foodz-800",
      link: "bg-transparent p-0 h-auto text-foodz-500 hover:text-foodz-600 underline-offset-4 hover:underline"
    };
    
    // Size styles
    const sizeStyles = {
      sm: "text-xs h-8 px-3",
      md: "text-sm h-10 px-5",
      lg: "text-base h-12 px-7"
    };
    
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!isLoading && icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        
        <span>{children}</span>
        
        {!isLoading && icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
