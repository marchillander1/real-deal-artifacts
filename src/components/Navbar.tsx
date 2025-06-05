
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
          <Logo size="md" variant="full" />
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
