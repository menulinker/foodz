
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AuthContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthContainer = ({ children, title, subtitle }: AuthContainerProps) => {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-medium text-foodz-600 hover:text-foodz-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>
      
      <div className="glass-card p-8 rounded-2xl">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
