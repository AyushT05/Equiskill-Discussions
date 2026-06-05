import { auth } from "../firebase/setup";
import Avatar from "react-avatar";
import PostPopup from "./PostPopup";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, Home, BookOpen, Users, PenLine, User } from "lucide-react";
import equiskill from "../assets/Equiskill.png";

type SearchProp = {
  setSearch?: (searchTerm: string) => void;
};

const Navbar: React.FC<SearchProp> = (props) => {
  const [post, setPost] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { icon: Home, label: "Home", path: "/main" },
    { icon: BookOpen, label: "Topics", path: "/main" },
    { icon: Users, label: "Community", path: "/main" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4">
      {/* Logo */}
      <Link to="/main" className="flex items-center gap-2 flex-shrink-0">
        <img src={equiskill} className="h-8 w-auto" alt="EquiSkill" />
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-1 ml-4">
        {navLinks.map(({ icon: Icon, label, path }) => (
          <Link
            key={label}
            to={path}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === path
                ? "text-blue-700 bg-blue-50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              props.setSearch?.(e.target.value);
            }}
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative">
          <Bell size={18} />
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          {auth?.currentUser?.email ? (
            <Avatar round size="28" name={auth.currentUser.email} />
          ) : (
            <User size={18} />
          )}
        </button>

        <button
          onClick={() => setPost(true)}
          className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <PenLine size={14} />
          Ask
        </button>
      </div>

      {post && <PostPopup setPost={setPost} />}
    </header>
  );
};

export default Navbar;
