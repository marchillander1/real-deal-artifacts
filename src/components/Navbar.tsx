
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo size="md" variant="full" />
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"}
                className="text-sm"
              >
                Dashboard
              </Button>
            </Link>
            
            <Link to="/cv-upload">
              <Button 
                variant={location.pathname === "/cv-upload" ? "default" : "ghost"}
                className="text-sm flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                CV Upload
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
