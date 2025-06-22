
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Hide login functionality on CV upload page
  const showAuthButtons = location.pathname !== '/cv-upload';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/my-profile" className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 cursor-pointer text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
