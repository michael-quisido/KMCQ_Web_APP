"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { SiGithub, SiBluesky } from "react-icons/si";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PageLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItems = ["Home", "Products", "Reviews", "Blog", "About Us"];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col pt-5 pl-5 pr-5 relative z-10">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col">
          <div className="flex flex-col md:flex-row items-start md:justify-between">
            <div className="flex items-center gap-2 pl-[5px] pt-[5px]">
              <Image
                src="/kmcq-cloud-company-white-logo.png"
                alt="KMCQ Company Logo"
                width={150}
                height={58}
                unoptimized
                loading="eager"
                className="w-[90px] sm:w-[110px] md:w-[120px]"
                style={{ height: 'auto' }}
              />
              <span className="font-ubuntu text-white text-[24px] sm:text-[30px] md:text-[40px] font-bold tracking-wide translate-x-[3px] md:translate-y-[35px]">
                KMCQ GmbH
              </span>
            </div>
            <div className="flex flex-col items-end pt-[10px] md:pt-[50px] pr-[20px] mr-[-1px]">
              <div className="flex items-center gap-[55px] pb-[5px] md:pb-[10px] mt-[-17px] md:mt-[-17px]">
                <form action="https://www.google.com/search" method="get" target="_blank" className="hidden md:flex items-center" style={{ width: 171, height: 30 }}>
                  <input
                    type="text"
                    name="q"
                    placeholder="Search..."
                    className="w-full h-full px-3 rounded-l text-black text-sm bg-white"
                    style={{ width: 171, height: 30 }}
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center px-2 h-full rounded-r bg-gray-200"
                    style={{ height: 30 }}
                  >
                    <FaSearch size={16} color="#666" />
                  </button>
                </form>
                <div className="flex items-center gap-[17px]">
                  <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
                    <FaLinkedin size={30} color="#939393" style={{ height: 30, width: 'auto' }} />
                  </a>
                  <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
                    <FaFacebook size={30} color="#939393" style={{ height: 30, width: 'auto' }} />
                  </a>
                  <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
                    <FaInstagram size={30} color="#939393" style={{ height: 30, width: 'auto' }} />
                  </a>
                  <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
                    <FaYoutube size={30} color="#939393" style={{ height: 30, width: 'auto' }} />
                  </a>
                  <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
                    <SiGithub size={30} color="#939393" style={{ height: 30, width: 'auto' }} />
                  </a>
                  <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
                    <SiBluesky size={30} color="#939393" style={{ height: 30, width: 'auto' }} />
                  </a>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-[5px] md:gap-[45px] mt-[17px]">
                {menuItems.map((item, index) => (
                  <div 
                    key={item} 
                    className="px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: hoveredIndex === index ? 'white' : 'transparent'
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={item === "Home" ? "/" : item === "Blog" ? "/blog" : item === "About Us" ? "/#about-us" : `/#${item.toLowerCase().replace(" ", "-")}`}
                      className="font-ubuntu text-[17px] transition-colors"
                      style={{ color: hoveredIndex === index ? 'black' : 'white' }}
                    >
                      {item}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex flex-col">
          {/* Social Icons - Top Right */}
          <div className="flex items-center justify-end gap-3 pr-[20px]">
            <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
              <FaLinkedin size={24} color="#939393" />
            </a>
            <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
              <FaFacebook size={24} color="#939393" />
            </a>
            <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
              <FaInstagram size={24} color="#939393" />
            </a>
            <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
              <FaYoutube size={24} color="#939393" />
            </a>
            <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
              <SiGithub size={24} color="#939393" />
            </a>
            <a href="#" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
              <SiBluesky size={24} color="#939393" />
            </a>
          </div>
          {/* Logo + KMCQ GmbH - Left Side + Hamburger - Right Side */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 pl-[5px]">
              <Image
                src="/kmcq-cloud-company-white-logo.png"
                alt="KMCQ Company Logo"
                width={150}
                height={58}
                unoptimized
                loading="eager"
                className="w-[90px]"
                style={{ height: 'auto' }}
              />
              <span className="font-ubuntu text-white text-[24px] font-bold tracking-wide">
                KMCQ GmbH
              </span>
            </div>
            <button 
              className="text-white p-2 mr-[15px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="flex flex-col items-end mt-4 space-y-4 z-50 pr-[20px]">
              {menuItems.map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : item === "Blog" ? "/blog" : item === "About Us" ? "/#about-us" : `/#${item.toLowerCase().replace(" ", "-")}`}
                  className="font-ubuntu text-[20px] text-white hover:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ minHeight: '60vh', padding: '15px 0 0 0', position: 'relative', zIndex: 5 }}>
        {children}
      </div>

      {/* Footer */}
      <div 
        className="footer-section w-full p-0 relative z-40"
        style={{ 
          marginTop: '0px', 
          marginBottom: '0px', 
          paddingTop: '60px', 
          paddingBottom: '40px',
          paddingLeft: '40px',
          paddingRight: '40px',
          backgroundColor: '#040f2d'
        }}
      >
        <style jsx global>{`
          @media (max-width: 768px) {
            .footer-first-row {
              flex-direction: column !important;
              align-items: flex-start !important;
              width: 100% !important;
            }
            .footer-first-row > div {
              width: 100% !important;
            }
            .footer-second-row {
              flex-direction: column !important;
            }
            .footer-second-row > div:first-child {
              padding-left: 0px !important;
            }
            .footer-second-row > div:last-child {
              padding-right: 0px !important;
            }
            .footer-second-col-empty {
              display: none !important;
            }
          }
          .footer-link:hover {
            color: #ffffff !important;
            text-decoration: underline !important;
          }
          .footer-link:hover svg {
            color: #ffffff !important;
          }
        `}</style>
        {/* First Row - Four Columns */}
        <div className="footer-first-row" style={{ display: 'flex', flexDirection: 'row', gap: '40px', marginBottom: '40px', width: '65%', margin: '0 auto 40px auto' }}>
          {/* First Column */}
          <div style={{ flex: 1, padding: '20px' }}>
            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>About Us</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Link href="/about" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>KMCQ GmbH</Link>
              <Link href="/careers" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>Career/Jobs</Link>
              <Link href="/partners" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>Partners</Link>
              <Link href="/contact" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>Contact Us</Link>
            </div>
          </div>
          {/* Second Column */}
          <div style={{ flex: 1, padding: '20px' }}>
            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Products</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Link href="/data-hosting" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>Data Hosting</Link>
              <Link href="/wordpress" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>WordPress</Link>
              <Link href="/joomla" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>Joomla</Link>
              <Link href="/drupal" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>Drupal</Link>
              <Link href="/vps" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>VPS</Link>
              <Link href="/email-hosting" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>Email Hosting</Link>
            </div>
          </div>
          {/* Third Column */}
          <div style={{ flex: 1, padding: '20px' }}>
            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Community</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Link href="/community" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>KMCQ Community</Link>
            </div>
          </div>
          {/* Fourth Column */}
          <div style={{ flex: 1, padding: '20px' }}>
            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Learn More</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Link href="/faqs" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>FAQs</Link>
              <Link href="/blog" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>Our Blog</Link>
              <Link href="/contributor" className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>Become a Contributor</Link>
            </div>
          </div>
        </div>
        {/* Second Row - Three Columns */}
        <div className="footer-second-row" style={{ display: 'flex', flexDirection: 'row', gap: '40px', borderTop: '1px solid #1a2a4d', paddingTop: '30px', paddingLeft: '20px', paddingRight: '20px' }}>
          {/* First Column */}
          <div style={{ flex: 1.1, padding: '20px', paddingLeft: '50px' }}>
            <Link href="/" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', textDecoration: 'none' }}>
              <Image 
                src="/kmcq-cloud-company-white-logo.png"
                alt="KMCQ Logo"
                width={50}
                height={50}
                style={{ objectFit: 'contain' }}
              />
              <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }}>KMCQ GmbH</span>
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#9d9d9d', fontSize: '14px' }}>All rights reserved.</span>
              <span style={{ color: '#9d9d9d', fontSize: '14px' }}>569 A. Apostol St. Brgy. Tungkop, Minglanilla, Central Visayas, Cebu 6046</span>
              <span style={{ color: '#9d9d9d', fontSize: '14px' }}>+639171229475</span>
              <span style={{ color: '#9d9d9d', fontSize: '14px' }}>support@kmcq.com</span>
              <span style={{ color: '#9d9d9d', fontSize: '14px' }}><Link href="/terms" className="footer-link" style={{ color: '#9d9d9d', textDecoration: 'none' }}>Terms of Use</Link> | <Link href="/policy" className="footer-link" style={{ color: '#9d9d9d', textDecoration: 'none' }}>Policy</Link></span>
            </div>
          </div>
          {/* Second Column - Empty */}
          <div className="footer-second-col-empty" style={{ flex: 0.9 }}></div>
          {/* Third Column - Social Media */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', padding: '20px', paddingRight: '50px' }}>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link"><FaLinkedin size={24} color="#9d9d9d" /></Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-link"><FaFacebook size={24} color="#9d9d9d" /></Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link"><FaInstagram size={24} color="#9d9d9d" /></Link>
            <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-link"><FaYoutube size={24} color="#9d9d9d" /></Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link"><SiGithub size={24} color="#9d9d9d" /></Link>
            <Link href="https://bsky.app" target="_blank" rel="noopener noreferrer" className="footer-link"><SiBluesky size={24} color="#9d9d9d" /></Link>
          </div>
        </div>
      </div>
    </>
  );
}
