
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" variant="full" />
          {user ? (
            <Button onClick={signOut} variant="outline">
              Logga ut
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
