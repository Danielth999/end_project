import React from "react";
import Link from "next/link"; // Import Link from Next.js

export default function FooterDarkTheme() {
  return (
    <>
      <footer className="w-full text-slate-400">
        <div className="border-t border-slate-900 bg-slate-800 pb-12 pt-16 text-sm">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
              <nav
                className="col-span-2 md:col-span-4 lg:col-span-3"
                aria-labelledby="footer-product-dark"
              >
                <h3
                  className="mb-6 text-base font-medium text-white"
                  id="footer-product-dark"
                >
                  Product
                </h3>
                <ul>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/features"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Features
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/customers"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Customers
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/why-us"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Why us?
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/pricing"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </nav>
              <nav
                className="col-span-2 md:col-span-4 lg:col-span-3"
                aria-labelledby="footer-docs-dark"
              >
                <h3
                  className="mb-6 text-base font-medium text-white"
                  id="footer-docs-dark"
                >
                  Docs & help
                </h3>
                <ul>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/documentation"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/training"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Training
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/system-status"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      System status
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/faqs"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      FAQs
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/help-center"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Help Center
                    </Link>
                  </li>
                </ul>
              </nav>
              <nav
                className="col-span-2 md:col-span-4 lg:col-span-3"
                aria-labelledby="footer-about-dark"
              >
                <h3
                  className="mb-6 text-base font-medium text-white"
                  id="footer-about-dark"
                >
                  About us
                </h3>
                <ul>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/about-us"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      About us
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/careers"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Careers
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/leadership"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Leadership
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/blog"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Blog
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/events"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Events
                    </Link>
                  </li>
                </ul>
              </nav>
              <nav
                className="col-span-2 md:col-span-4 lg:col-span-3"
                aria-labelledby="footer-get-in-touch-dark"
              >
                <h3
                  className="mb-6 text-base font-medium text-white"
                  id="footer-get-in-touch-dark"
                >
                  Get in touch
                </h3>
                <ul>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/contact"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Contact
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/support"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Support
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/partners"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Partners
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/join-research"
                      className="transition-colors duration-300 hover:text-teal-500 focus:text-teal-600"
                    >
                      Join research
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-900 bg-slate-700 py-4 text-sm">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
              <div className="col-span-2 md:col-span-4 lg:col-span-6">
                Copyright 2024 Brand
              </div>
              <nav
                aria-labelledby="footer-social-links-dark"
                className="col-span-2 text-right md:col-span-4 lg:col-span-6"
              >
                <h2 className="sr-only" id="footer-social-links-dark">
                  Social Media Links
                </h2>
                <ul className="flex items-center justify-end gap-4">
                  <li>
                    <Link
                      href="/facebook"
                      className="transition-colors duration-300 hover:text-teal-500"
                    >
                      {/* Facebook Icon */}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/twitter"
                      className="transition-colors duration-300 hover:text-teal-500"
                    >
                      {/* Twitter Icon */}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/instagram"
                      className="transition-colors duration-300 hover:text-teal-500"
                    >
                      {/* Instagram Icon */}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
