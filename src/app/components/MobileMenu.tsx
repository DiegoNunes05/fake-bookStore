import React from "react";
import {Menu, X} from "lucide-react";

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  menuOpen,
  setMenuOpen,
}) => {
  return (
    <div className="md:hidden fixed bottom-4 right-4 bg-slate-400 rounded-full">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`p-2 rounded-full transition-all duration-800 ease-in-out`}
      >
        {menuOpen ? (
          <X
            size={24}
            className="transition-transform duration-800 ease-in-out transform rotate-90"
          />
        ) : (
          <Menu
            size={24}
            className="transition-transform duration-3800 ease-in-out transform rotate-0"
          />
        )}
      </button>
    </div>
  );
};

export default MobileMenu;
