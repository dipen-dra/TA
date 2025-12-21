import { GraduationCap, TvMinimalPlay, Sun, Moon, ClipboardList, Menu, User, LogOut, Settings } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetCredentials, auth } = useContext(AuthContext); // Added auth to access user name for avatar fallback
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between p-3 border-b bg-white shadow-md">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            <Menu className="w-7 h-7 text-gray-700" />
          </button>
          <Link to="/student/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-12">
            <img
              src="/tayari-adda-logo.png"
              alt="Tayari Adda"
              className="h-16 w-auto"
            />
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/student/home")}
            className={`text-base font-medium ${isActive("/student/home") || location.pathname === "/student"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600"
              }`}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/student/courses")}
            className={`text-base font-medium ${isActive("/student/courses")
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600"
              }`}
          >
            Courses
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/student/quiz")}
            className={`text-base font-medium ${isActive("/student/quiz")
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600"
              }`}
          >
            MCQ
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/student/student-courses")}
            className={`text-base font-medium ${isActive("/student/student-courses")
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600"
              }`}
          >
            Learning
          </Button>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all w-10 h-10">
                <AvatarImage
                  src={auth?.user?.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/220px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg"}
                  alt="User"
                  className="object-cover"
                />
                <AvatarFallback className="bg-black text-white font-bold">
                  {auth?.user?.userName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium leading-none">{auth?.user?.fName || auth?.user?.userName || "Student"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{auth?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/student/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowLogoutDialog(true)} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t p-4 flex flex-col space-y-4 md:hidden shadow-lg">
            <Button variant="ghost" onClick={() => navigate("/student/home")} className="text-base font-medium text-gray-700 hover:text-blue-600 justify-start">
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/student/courses")} className="text-base font-medium text-gray-700 hover:text-blue-600 justify-start">
              Courses
            </Button>
            <Button variant="ghost" onClick={() => navigate("/student/quiz")} className="text-base font-medium text-gray-700 hover:text-blue-600 justify-start">
              MCQ
            </Button>
            <Button variant="ghost" onClick={() => navigate("/student/student-courses")} className="text-base font-medium text-gray-700 hover:text-blue-600 justify-start">
              Learning
            </Button>
            <Button onClick={() => setShowLogoutDialog(true)} className="bg-red-500 hover:bg-red-600 text-white font-medium">
              Logout
            </Button>
          </div>
        )}
      </header>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <LogOut className="w-8 h-8" />
              </div>
            </div>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your courses and progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default StudentViewCommonHeader;


