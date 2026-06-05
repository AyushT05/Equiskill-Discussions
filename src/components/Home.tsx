import { useState } from "react";
import Leftbar from "./Leftbar";
import Rightbar from "./Rightbar";

type SearchProp = {
  search: string;
  menu: any;
  setMenu: (menu: any) => void;
};

const Home: React.FC<SearchProp> = ({ search, menu, setMenu }) => {
  const [activeMenu, setActiveMenu] = useState<string>("");

  const handleSetMenu = (item: any) => {
    setActiveMenu(item.title);
    setMenu(item);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 pt-14">
      {/* Left Sidebar */}
      <aside className="w-60 fixed left-0 top-14 bottom-0 bg-white border-r border-slate-200 p-3 overflow-y-auto">
        <Leftbar setMenu={handleSetMenu} activeMenu={activeMenu} />
      </aside>

      {/* Main Feed */}
      <main className="flex-1 ml-60 p-6 max-w-3xl">
        <Rightbar search={search} menu={menu} />
      </main>

      {/* Right info panel */}
      <aside className="hidden xl:block w-72 fixed right-0 top-14 bottom-0 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">About EquiSkill Discussions</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            A student-first Q&amp;A platform where curiosity meets community. Ask questions, share knowledge, and learn together.
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">AI-Powered Answers</h3>
          <p className="text-xs text-blue-600 leading-relaxed">
            Every new question receives an instant AI-generated response to get you started faster.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Home;
