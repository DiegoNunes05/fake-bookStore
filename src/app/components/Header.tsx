"use client";

import {CardDescription, CardTitle} from "@/components/ui/card";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Star } from "lucide-react";

interface HeaderProps {
  favorites: string[];
}

export default function Header({favorites}: HeaderProps) {
  return (
    <header className="bg-slate-100 relative">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-4"
      >
        <div className="flex lg:flex-1">
          <a href="#" onClick={() => window.location.reload()}>
            <span className="sr-only">Test BookStore</span>
            <GraduationCap className="w-6 h-6" />
          </a>
        </div>
        <div>
          <span className="font-playwrite text-xs lg:text-xl">
            Where stories find their perfect readers...
          </span>
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end cursor-pointer">
          <Popover>
            <PopoverTrigger asChild>
              <Star className="w-5 h-5" />
            </PopoverTrigger>
            <PopoverContent
              key={favorites.length}
              className="ml-4 mr-4 max-w-xs"
              style={{overflow: "hidden"}}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between items-center">
                    <CardTitle className="text-xl font-roboto">
                      Notifications
                    </CardTitle>
                  </div>
                  <CardDescription className="font-roboto">
                    <p className="text-sm text-gray-600">
                      {favorites.length > 0
                        ? `You have ${favorites.length} favorite book(s)!`
                        : "You don't have any favorite books!"}
                    </p>
                    <Separator className="mt-2" />
                    {favorites.length > 0 && (
                      <div className="mt-5">
                        {favorites.map((favorite, index) => (
                          <div key={index} className="flex flex-col">
                            <p
                              key={index}
                              className="text-xl font-smooch font-bold text-black"
                            >
                              {favorite}
                            </p>
                            <div className="mt-2 border-b border-dotted border-gray-300"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-center justify-center py-8">
                  {favorites.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="flex flex-col items-center animate-fade-in">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-[var(--primary-green)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="mt-5 text-md font-medium font-roboto">
                          {"You don't have any favorite books!"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
      <style jsx>{`
        header::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          min-width: 100%;
          transform: translateX(-50%);
          height: 1px;
          background: linear-gradient(to right, transparent, gray, transparent);
        }
      `}</style>
    </header>
  );
}
