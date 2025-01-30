"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook} from "@fortawesome/free-solid-svg-icons";

const categories = ["Romance", "Magic", "Action", "History", "Horror", "Programming"];

interface SidebarProps {
  setActiveCategory: (name: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  className: string;
}

export default function Sidebar({
    setActiveCategory,
    menuOpen,
    setMenuOpen
}: SidebarProps) {
  const handleCategoryClick = (category: string) => {
    console.log("Category clicked:", category); 
    setActiveCategory(category);
    setMenuOpen(false);
  };
  return (
    <aside
      className={`
        transform transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:block w-56 p-4 xl:pe-0 absolute h-full border-r-[1px] bg-slate-50
      `}
    >
      <div className="flex items-center justify-between gap-2 mb-4 pr-3">
        <h2 className="text-xl font-medium font-roboto">Categories</h2>
        <FontAwesomeIcon icon={faBook} className="w-4 h-4 mb-[3px]" />
      </div>

      <Accordion type="single" collapsible className="w-full pr-3">
        <AccordionItem value="categories">
          <AccordionTrigger className="py-1 hover:no-underline hover:text-blue-800">
            <span className="font-smooch text-xl font-semibold">
              Book Categories
            </span>
          </AccordionTrigger>

          <AccordionContent>
            <ul className="ml-6 pl-3">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="w-full text-left text-lg font-medium font-smooch hover:text-blue-500"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

;
