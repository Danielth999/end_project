import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

const FooterJsonLd = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Art Space",
    "url": "https://www.artspaceth.online",
    "logo": "https://www.artspaceth.online/image/logo.png",
    "sameAs": [
      "https://facebook.com/artspace",
      "https://twitter.com/artspace",
      "https://instagram.com/artspace"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+66-1234-5678",
      "contactType": "Customer Service",
      "areaServed": "TH",
      "availableLanguage": ["Thai", "English"]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
};

const Footer = () => {
  return (
    <>
      <FooterJsonLd />
      <footer
        className="text-white bg-gradient-to-b from-[#0a0d12] to-gray-900"
        itemScope
        itemType="http://schema.org/WPFooter"
      >
        <div className="pt-16 pb-12 text-sm">
          <div className="container px-6 mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
              {/* เกี่ยวกับเรา */}
              <div
                className="col-span-1 md:col-span-2 lg:col-span-2"
                itemProp="about"
              >
                <Link
                  href="/"
                  className="mb-6 text-2xl font-bold text-[#20b256] block"
                >
                  Art Space
                </Link>
                <p className="text-gray-300 mb-6" itemProp="description">
                  Art Space
                  เป็นแพลตฟอร์มสำหรับการค้นพบและซื้อขายผลงานศิลปะดิจิทัล
                  ที่รวบรวมผลงานจากศิลปินทั่วโลก
                </p>
              </div>

              {/* หมวดหมู่: ภาพศิลปะ */}
              <nav aria-labelledby="footer-artworks">
                <h3
                  className="mb-6 text-lg font-semibold text-[#20b256]"
                  id="footer-artworks"
                >
                  ภาพศิลปะ
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/artworks"
                      className="text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      สำรวจภาพศิลปะ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/create-artworks"
                      className="text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      สร้างผลงาน
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auctions"
                      className="text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      การประมูล
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* หมวดหมู่: ช่วยเหลือ */}
              <nav aria-labelledby="footer-help">
                <h3
                  className="mb-6 text-lg font-semibold text-[#20b256]"
                  id="footer-help"
                >
                  ช่วยเหลือ
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      คำถามที่พบบ่อย
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      สนับสนุน
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      ติดต่อเรา
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      ข้อกำหนดและเงื่อนไข
                    </a>
                  </li>
                </ul>
              </nav>

              {/* หมวดหมู่: ติดตามเรา */}
              <nav aria-labelledby="footer-social">
                <h3
                  className="mb-6 text-lg font-semibold text-[#20b256]"
                  id="footer-social"
                >
                  ติดตามเรา
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="https://facebook.com/artspace"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      <Facebook className="w-5 h-5 mr-2" />
                      <span>Facebook</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://twitter.com/artspace"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      <Twitter className="w-5 h-5 mr-2" />
                      <span>Twitter</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://instagram.com/artspace"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-[#20b256] transition-colors"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      <span>Instagram</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div className="py-4 text-sm border-t border-gray-800">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="text-gray-400" itemProp="copyrightNotice">
                © 2024 Art Space. สงวนลิขสิทธิ์
              </div>
              <nav aria-labelledby="subfooter-links">
                <h3 className="sr-only" id="subfooter-links">
                  ลิงก์กฎหมาย
                </h3>
                <ul className="flex flex-wrap items-center gap-4">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#20b256] transition-colors"
                    >
                      ข้อกำหนดและเงื่อนไข
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#20b256] transition-colors"
                    >
                      นโยบายความเป็นส่วนตัว
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#20b256] transition-colors"
                    >
                      คุกกี้
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
