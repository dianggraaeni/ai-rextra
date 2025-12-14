import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, Menu, X } from "lucide-react";

const Navbar = ({ floating = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "about-cards", label: "Profil" },
    { id: "product", label: "Produk" },
    { id: "features", label: "Fitur" },
    { id: "community", label: "Komunitas" },
    { id: "faq", label: "FAQ" },
    { id: "get-started", label: "Mulai" },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    // Cek apakah sedang di landing page
    if (location.pathname === "/") {
      // Jika di landing page, langsung scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Jika tidak di landing page, navigate ke landing page dengan hash
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-3 z-50">
      <div className="w-full px-0 md:px-6 lg:px-8">
        <div className="relative w-full max-w-6xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200 md:rounded-full md:px-4 lg:px-8">
          <div className="relative grid grid-cols-[auto_1fr_auto] items-center px-4 py-3 md:py-2">
            {/* Left: Logo */}
            <div className="flex items-center justify-start">
              <Link to="/" className="flex items-center">
                <img src="/logo.svg" alt="REXTRA" className="w-24 md:w-26 lg:w-26 h-auto" />
              </Link>
            </div>

            {/* Center: Nav items */}
            <div className="hidden md:flex justify-center">
              <ul className="inline-flex items-center space-x-6">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-sm font-medium text-sky-700 hover:text-sky-900 px-3 py-2 rounded-full transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Download CTA + Mobile menu */}
            <div className="flex items-center justify-end space-x-3">
              <Link
                to="/unduh"
                className="hidden md:inline-flex items-center gap-1 sm:gap-2 bg-[#0057FF] text-white font-semibold px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-md hover:shadow-lg border border-[#0057FF]"
              >
                Unduh
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-full bg-white/80 shadow-sm"
                onClick={() => setMobileOpen((s) => !s)}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
              <div className="px-4 py-4">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          scrollToSection(item.id);
                          setMobileOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-sky-700 hover:bg-sky-50 transition-colors"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                  <li className="pt-3 mt-2 border-t border-gray-100">
                    <Link
                      to="/unduh"
                      className="block w-full text-center bg-[#0057FF] text-white font-semibold px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
                      onClick={() => setMobileOpen(false)}
                    >
                      Unduh <Download className="w-4 h-4 inline-block ml-2" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
