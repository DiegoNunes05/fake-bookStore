"use client"

import { useState } from "react";
import BookList from "./components/BookList";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileMenu from "./components/MobileMenu";
import BookManagement from "./components/BookManagement";

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("");
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex justify-center">
        <div className="flex w-full max-w-7xl">
          <Sidebar
            setActiveCategory={setActiveCategory}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            className=""
          />
          <main className="flex-1 md:ml-56 pb-10">
            <BookList activeCategory={activeCategory} />
          </main>
        </div>
      </div>
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* <BookManagement /> */}
    </div>
  );
}
