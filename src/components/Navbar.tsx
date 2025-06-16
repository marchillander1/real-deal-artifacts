
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Hide login functionality on CV upload page
  const showAuthButtons = location.pathname !== '/cv-upload';

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" variant="full" />
          {showAuthButtons && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.email}
                  </span>
                  <Button onClick={signOut} variant="outline">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link to="/pricing-auth">Get Started</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
