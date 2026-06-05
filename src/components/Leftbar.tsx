import React from "react";
import { FlaskConical, Calculator, Globe, Brain, Code, Monitor, Briefcase, LayoutGrid } from "lucide-react";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  content: string[];
}

interface MenuProp {
  setMenu: (menu: any) => void;
  activeMenu?: string;
}

export const menuItems: MenuItem[] = [
  {
    title: "Science",
    icon: FlaskConical,
    color: "text-emerald-600 bg-emerald-50",
    description: "Explore scientific concepts and discoveries.",
    content: ["Physics fundamentals", "Chemistry reactions", "Biology systems", "Earth science", "Astronomy"],
  },
  {
    title: "Mathematics",
    icon: Calculator,
    color: "text-violet-600 bg-violet-50",
    description: "Master mathematical concepts from basics to advanced.",
    content: ["Algebra", "Calculus", "Geometry", "Statistics", "Number theory"],
  },
  {
    title: "Social Science",
    icon: Globe,
    color: "text-amber-600 bg-amber-50",
    description: "Understand society, history, and human behavior.",
    content: ["History", "Geography", "Economics", "Political science", "Sociology"],
  },
  {
    title: "Machine Learning",
    icon: Brain,
    color: "text-pink-600 bg-pink-50",
    description: "Dive into AI and machine learning algorithms.",
    content: ["Supervised learning", "Neural networks", "NLP", "Computer vision", "Reinforcement learning"],
  },
  {
    title: "Web Development",
    icon: Code,
    color: "text-blue-600 bg-blue-50",
    description: "Build modern web applications.",
    content: ["HTML/CSS", "JavaScript", "React", "Node.js", "Databases"],
  },
  {
    title: "Computer Science",
    icon: Monitor,
    color: "text-cyan-600 bg-cyan-50",
    description: "Core CS concepts and algorithms.",
    content: ["Data structures", "Algorithms", "OS concepts", "Networks", "Compilers"],
  },
  {
    title: "Business Studies",
    icon: Briefcase,
    color: "text-orange-600 bg-orange-50",
    description: "Learn business, management, and entrepreneurship.",
    content: ["Marketing", "Finance", "Management", "Strategy", "Entrepreneurship"],
  },
];

const Leftbar: React.FC<MenuProp> = ({ setMenu, activeMenu }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-3 py-3 mb-1">
        <LayoutGrid size={15} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categories</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.title;
          return (
            <button
              key={item.title}
              onClick={() => setMenu(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className={`p-1.5 rounded-md flex-shrink-0 ${isActive ? "bg-white/20" : item.color}`}>
                <Icon size={14} />
              </span>
              <span className="text-sm font-medium truncate">{item.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-slate-200 px-3">
        <p className="text-xs text-slate-400 leading-relaxed">
          EquiSkill Discussions &mdash; A space for curious learners.
        </p>
      </div>
    </div>
  );
};

export default Leftbar;
