import { useState } from "react";
import Home from "./Home";
import Navbar from "./Navbar";

interface MenuItem {
  title: string;
  description: string;
  content: string[];
}

const Main = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar setSearch={setSearch} />
      <Home search={search} menu={selectedMenu} setMenu={setSelectedMenu} />
    </div>
  );
};

export default Main;
