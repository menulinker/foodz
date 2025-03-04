
import { useEffect, useRef, useState } from "react";
import { 
  Utensils, 
  LineChart, 
  ShoppingBag, 
  Edit, 
  Clock, 
  Smartphone,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Link } from "react-router-dom";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref}
      className={`glass-card hover-lift rounded-xl p-6 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10"
      }`}
      style={{ 
        transitionDelay: `${index * 100}ms`, 
        transitionProperty: "all",
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      <div className="h-12 w-12 bg-foodz-100 rounded-full flex items-center justify-center text-foodz-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Utensils className="h-6 w-6" />,
      title: "Menu Management",
      description: "Create beautiful digital menus with customizable categories, items, and specials."
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Order Processing",
      description: "Seamlessly receive and manage customer orders in real-time with automated notifications."
    },
    {
      icon: <Edit className="h-6 w-6" />,
      title: "Profile Customization",
      description: "Build your restaurant's unique profile with images, descriptions, hours, and contact info."
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Track sales performance, popular items, and customer trends with intuitive visualizations."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Reservation System",
      description: "Allow customers to make reservations directly through your restaurant profile."
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Ordering",
      description: "Give customers the flexibility to browse your menu and place orders from any device."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-foodz-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block mb-3 px-3 py-1 text-xs font-medium text-foodz-700 bg-foodz-100 rounded-full">
            Core Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to streamline your restaurant
          </h2>
          <p className="text-muted-foreground text-lg">
            Foodz provides a suite of tools designed specifically for restaurant owners to manage their business efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <Button 
            variant="primary" 
            size="lg" 
            className="group" 
            asChild
          >
            <Link to="/features">
              Explore All Features
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
