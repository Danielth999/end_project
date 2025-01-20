"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Home, LayoutGrid, MessageCircle, Newspaper, Gavel, Plus, Menu, X, Search } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Profile from "./Profile";
import WalletComponent from "./Wallet";
import Cart from "./Cart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const navlinks = [
  {
    name: "Home",
    link: "/",
    icon: <Home className="w-6 h-6 text-[#20b256]" />,
  },
  {
    name: "ภาพศิลปะ",
    link: "/artworks",
    icon: <LayoutGrid className="w-6 h-6 text-[#20b256]" />,
  },
  {
    name: "ประมูล",
    link: "/auctions",
    icon: <Gavel className="w-6 h-6 text-[#20b256]" />,
  },
  {
    name: "สร้างผลงาน",
    link: "/create-artworks",
    icon: <Plus className="w-6 h-6 text-[#20b256]" />,
  },
];

const Navbar = ({ userId }) => {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      router.push("/artworks");
    } else {
      router.push(`/artworks?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Hamburger Menu */}
          <div className="flex items-center">
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-full"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="ml-4 md:ml-0">
              <span className="text-2xl font-bold text-white">Art Space</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-[458px] mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ค้นหางานศิลปะ"
                className="w-full py-2 pl-4 pr-10 text-sm bg-gray-900 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#20b256]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="absolute right-0 top-0 mt-2 mr-2"
                onClick={handleSearch}
                aria-label="Search"
              >
                <Search size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isSignedIn && (
              <>
                <WalletComponent />
                <Cart userId={userId} />
              </>
            )}
            <Profile />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navlinks.map((link) => (
            <Link
              key={link.name}
              href={link.link}
              className="flex items-center space-x-3 text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
        {isSignedIn && (
          <div className="px-4 py-3 border-t border-gray-700">
            <div className="flex items-center space-x-4">
              <WalletComponent />
              <Cart userId={userId} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;