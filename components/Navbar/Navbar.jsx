"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Home,
  LayoutGrid,
  MessageCircle,
  Newspaper,
  Gavel,
  Plus,
  Menu,
  X,
  Search,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Profile from "./Profile";
import WalletComponent from "./Wallet";
import { Cart } from "./Cart";
import Link from "next/link";

const navlinks = [
  {
    name: "Home",
    link: "/",
    icon: <Home className="w-6 h-6 dark:text-[#20b256]" />,
  },
  {
    name: "ภาพศิลปะ",
    link: "/products",
    icon: <LayoutGrid className="w-6 h-6 dark:text-[#20b256]" />,
  },
  {
    name: "ประมูล",
    link: "/auctions",
    icon: <Gavel className="w-6 h-6 dark:text-[#20b256]" />,
  },
  {
    name: "พูดคุย",
    link: "/forum",
    icon: <MessageCircle className="w-6 h-6 dark:text-[#20b256]" />,
  },
  {
    name: "ข่าวสาร",
    link: "/blog",
    icon: <Newspaper className="w-6 h-6 dark:text-[#20b256]" />,
  },
  {
    name: "สร้าง NFTs",
    link: "/create-nfts",
    icon: <Plus className="w-6 h-6 dark:text-[#20b256]" />,
  },
];

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between gap-6 px-4 py-2 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      {/* Hamburger Menu */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-full"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Search Bar */}
      <div className="flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] dark:bg-gray-900 bg-[#dbe4e9] rounded-[100px]">
        <input
          type="text"
          placeholder="Search for campaigns"
          className="flex w-full text-[14px] placeholder:text-[#4b5264] text-black dark:text-white bg-transparent outline-none"
        />
        <div className="w-[72px] h-full rounded-[20px] bg-[#2dac5c] dark:bg-[#20b256] flex justify-center items-center cursor-pointer">
          <Search size={15} className="text-white" />
        </div>
      </div>

      {/* Mobile Profile */}
      <div className="md:hidden flex items-center gap-4">
        <Profile />
      </div>

      {/* Dropdown Menu for Mobile */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 z-50">
          <ul className="flex flex-col items-start space-y-4">
            {navlinks.map((link) => (
              <li key={link.name}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={link.link}>
                        <div className="flex items-center gap-3 text-sm text-black dark:text-white">
                          {link.icon}
                          <span>{link.name}</span>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      {link.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            ))}
          </ul>
          {/* Mobile Profile and Wallet */}
          <div className="flex flex-col mt-6 gap-4 border-t border-gray-300 pt-4">
            {isSignedIn && (
              <div className="flex items-center gap-4">
                <WalletComponent />
                <Cart />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        {isSignedIn && (
          <>
            <WalletComponent />
            <Cart />
          </>
        )}
        <Profile />
      </div>
    </nav>
  );
};

export default Navbar;
