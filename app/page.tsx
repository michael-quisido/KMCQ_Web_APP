"use client";

import Image from "next/image";
import Link from "next/link";
import TypewriterText from "@/components/TypewriterText";
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { SiGithub, SiBluesky, SiWordpress, SiJoomla, SiDrupal } from "react-icons/si";
import { MdSettings, MdStorage, MdEmail, MdDns, MdCloud, MdComputer, MdWeb, MdDevices, MdSecurity, MdSpeed, MdLanguage, MdExtension, MdVisibility, MdAttachMoney } from "react-icons/md";

import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const DEFAULT_MENU_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/#products" },
    { label: "Reviews", href: "/#reviews" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/#about-us" },
  ];
  const DEFAULT_SECTIONS = [
    { section_key: "about", section_label: "About Us" },
    { section_key: "products", section_label: "Products" },
    { section_key: "community", section_label: "Community" },
    { section_key: "learn-more", section_label: "Learn More" },
    { section_key: "legal", section_label: "Terms & Policy" },
  ];
  const DEFAULT_FOOTER_ITEMS: { label: string; href: string; section: string }[] = [
    { label: "KMCQ GmbH", href: "/about", section: "about" },
    { label: "Career/Jobs", href: "/careers", section: "about" },
    { label: "Partners", href: "/partners", section: "about" },
    { label: "Contact Us", href: "/contact", section: "about" },
    { label: "Data Hosting", href: "/data-hosting", section: "products" },
    { label: "WordPress", href: "/wordpress", section: "products" },
    { label: "Joomla", href: "/joomla", section: "products" },
    { label: "Drupal", href: "/drupal", section: "products" },
    { label: "VPS", href: "/vps", section: "products" },
    { label: "Email Hosting", href: "/email-hosting", section: "products" },
    { label: "KMCQ Community", href: "/community", section: "community" },
    { label: "FAQs", href: "/faqs", section: "learn-more" },
    { label: "Our Blog", href: "/blog", section: "learn-more" },
    { label: "Become a Contributor", href: "/contributor", section: "learn-more" },
    { label: "Terms of Use", href: "/terms", section: "legal" },
    { label: "Policy", href: "/policy", section: "legal" },
  ];
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [footerItems, setFooterItems] = useState(DEFAULT_FOOTER_ITEMS);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<{ name: string; icon: string; description: string; url: string }[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [features, setFeatures] = useState<{ title: string; icon: string; content: string }[]>([]);
  const [reviews, setReviews] = useState<{ name: string; image: string; role: string; industry: string; text: string; rating: number }[]>([]);
  const [aboutSections, setAboutSections] = useState<{ section_name: string; title: string; content: string }[]>([]);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string; icon: string }[]>([]);
  const [heroTitle, setHeroTitle] = useState("Unlock Your Digital Future.");
  const [heroSubtitle, setHeroSubtitle] = useState("Seamless, Secure, Scalable Cloud Solutions.");

  const iconMap: Record<string, React.ReactNode> = {
    MdStorage: <MdStorage size={70} color="#040f2d" />,
    SiWordpress: <SiWordpress size={70} color="#040f2d" />,
    MdEmail: <MdEmail size={70} color="#040f2d" />,
    MdDns: <MdDns size={70} color="#040f2d" />,
    SiJoomla: <SiJoomla size={70} color="#040f2d" />,
    SiDrupal: <SiDrupal size={70} color="#040f2d" />,
    MdCloud: <MdCloud size={70} color="#040f2d" />,
    MdComputer: <MdComputer size={70} color="#040f2d" />,
    MdWeb: <MdWeb size={70} color="#040f2d" />,
    MdDevices: <MdDevices size={70} color="#040f2d" />,
    MdSecurity: <MdSecurity size={70} color="#040f2d" />,
    MdSpeed: <MdSpeed size={70} color="#040f2d" />,
    MdLanguage: <MdLanguage size={70} color="#040f2d" />,
    MdExtension: <MdExtension size={70} color="#040f2d" />,
    MdVisibility: <MdVisibility size={70} color="#040f2d" />,
    MdAttachMoney: <MdAttachMoney size={70} color="#040f2d" />,
  };

  function renderProductIcon(name: string, color: string) {
    const icons: Record<string, React.ReactNode> = {
      MdStorage: <MdStorage size={70} color={color} />,
      SiWordpress: <SiWordpress size={70} color={color} />,
      MdEmail: <MdEmail size={70} color={color} />,
      MdDns: <MdDns size={70} color={color} />,
      SiJoomla: <SiJoomla size={70} color={color} />,
      SiDrupal: <SiDrupal size={70} color={color} />,
      MdCloud: <MdCloud size={70} color={color} />,
      MdComputer: <MdComputer size={70} color={color} />,
      MdWeb: <MdWeb size={70} color={color} />,
      MdDevices: <MdDevices size={70} color={color} />,
      MdSecurity: <MdSecurity size={70} color={color} />,
      MdSpeed: <MdSpeed size={70} color={color} />,
      MdLanguage: <MdLanguage size={70} color={color} />,
      MdExtension: <MdExtension size={70} color={color} />,
      MdVisibility: <MdVisibility size={70} color={color} />,
      MdAttachMoney: <MdAttachMoney size={70} color={color} />,
    };
    return icons[name] || <MdStorage size={70} color={color} />;
  }

  function renderSocialIcon(name: string, size: number, color: string) {
    const icons: Record<string, React.ReactNode> = {
      FaLinkedin: <FaLinkedin size={size} color={color} />,
      FaFacebook: <FaFacebook size={size} color={color} />,
      FaInstagram: <FaInstagram size={size} color={color} />,
      FaYoutube: <FaYoutube size={size} color={color} />,
      SiGithub: <SiGithub size={size} color={color} />,
      SiBluesky: <SiBluesky size={size} color={color} />,
    };
    return icons[name] || null;
  }

  useEffect(() => {
    fetch("/api/content/products").then(r => r.json()).then(setProducts);
    fetch("/api/content/features").then(r => r.json()).then(setFeatures);
    fetch("/api/content/reviews").then(r => r.json()).then(setReviews);
    fetch("/api/content/about").then(r => r.json()).then(setAboutSections);
    fetch("/api/content/social-links").then(r => r.json()).then(setSocialLinks);
    fetch("/api/content/menu")
      .then(r => r.json())
      .then(data => { if (data && data.length > 0) setMenuItems(data); })
      .catch(() => {});
    fetch("/api/content/menu?location=footer")
      .then(r => r.json())
      .then(data => { if (data && data.length > 0) setFooterItems(data); })
      .catch(() => {});
    fetch("/api/content/menu-sections")
      .then(r => r.json())
      .then(data => { if (data && data.length > 0) setSections(data); })
      .catch(() => {});
    fetch("/api/content/hero")
      .then(r => r.json())
      .then(data => {
        if (data.title) setHeroTitle(data.title);
        if (data.subtitle) setHeroSubtitle(data.subtitle);
      })
      .catch(() => {});
  }, []);

  function getSectionLabel(key: string): string {
    return sections.find(s => s.section_key === key)?.section_label || key;
  }
  const [carouselDirection, setCarouselDirection] = useState<'left' | 'right' | 'paused'>('left');
  const [carouselPosition, setCarouselPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const directionRef = useRef<'left' | 'right' | 'paused'>('left');
  const lastTimeRef = useRef(0);
  const requestRef = useRef<number>(0);

  const animate = (time: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }
    
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    
    if (directionRef.current === 'left') {
      positionRef.current = (positionRef.current + (deltaTime / 120000)) % 1;
    } else if (directionRef.current === 'right') {
      positionRef.current = Math.max(0, positionRef.current - (deltaTime / 120000));
    }
    
    setCarouselPosition(positionRef.current);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    directionRef.current = carouselDirection;
  }, [carouselDirection]);

  useEffect(() => {
    const globeCanvas = document.getElementById('hero-globe-canvas') as HTMLCanvasElement | null;
    const particleCanvas = document.getElementById('particle-network') as HTMLCanvasElement | null;

    if (!globeCanvas || !particleCanvas) return;

    const globeCtx = globeCanvas.getContext('2d');
    const particleCtx = particleCanvas.getContext('2d');

    if (!globeCtx || !particleCtx) return;

    let currentPhase = 0;
    let phaseStartTime = Date.now();
    let animationFrame: number;

    const config = {
      phases: [
        { duration: 3000, name: 'globe-limited', text: 'Limited Capacity: 3 Regions', globeOpacity: 1.0, particleMode: 'globe', activeLocations: 3, particleCount: 50 },
        { duration: 5000, name: 'globe-expansion', text: '200+ Global Regions', globeOpacity: 1.0, particleMode: 'globe', activeLocations: 200, particleCount: 100 },
        { duration: 7000, name: 'network-expand', text: 'Elastic: 1 → 4,000 GPUs', globeOpacity: 0.3, particleMode: 'network', activeLocations: 200, particleCount: 150 },
        { duration: 6000, name: 'network-reform', text: 'Always Available. Everywhere.', globeOpacity: 1.0, particleMode: 'reform', activeLocations: 200, particleCount: 100 }
      ],
      globe: { radius: 120, rotationSpeed: 0.0003, locationCount: 200, pulseSpeed: 0.03 },
      colors: { primary: '#040f2d', light: '#040f2d', accent: '#040f2d', inactive: 'rgba(4, 15, 45, 0.3)', active: 'rgba(4, 15, 45, 0.9)', glow: 'rgba(4, 15, 45, 0.5)' },
      transition: { duration: 2000 }
    };

    const globe: { rotation: number; locations: { theta: number; phi: number; active: boolean; pulse: number; baseRadius: number }[]; opacity: number } = { rotation: 0, locations: [], opacity: 1.0 };
    let particles: { theta: number; phi: number; radius: number; targetTheta: number; targetPhi: number; targetRadius: number; networkX: number; networkY: number; networkVx: number; networkVy: number; size: number; opacity: number; pulse: number }[] = [];

    const resize = () => {
      const container = globeCanvas.parentElement;
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      globeCanvas.width = width;
      globeCanvas.height = height;
      particleCanvas.width = width;
      particleCanvas.height = height;
    };

    const generateGlobeLocations = () => {
      const locations: { theta: number; phi: number; active: boolean; pulse: number; baseRadius: number }[] = [];
      const count = config.globe.locationCount;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      for (let i = 0; i < count; i++) {
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / count);
        locations.push({ theta, phi, active: false, pulse: Math.random() * Math.PI * 2, baseRadius: config.globe.radius });
      }
      globe.locations = locations;
    };

    const createParticles = () => {
      particles = [];
      const count = config.phases[0].particleCount;
      const radius = config.globe.radius;
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        particles.push({
          theta, phi, radius, targetTheta: theta, targetPhi: phi, targetRadius: radius,
          networkX: 0, networkY: 0, networkVx: 0, networkVy: 0,
          size: Math.random() * 2.5 + 1.5, opacity: Math.random() * 0.5 + 0.5, pulse: Math.random() * Math.PI * 2
        });
      }
    };

    const updatePhase = () => {
      const elapsed = Date.now() - phaseStartTime;
      const currentPhaseConfig = config.phases[currentPhase];

      if (elapsed > currentPhaseConfig.duration) {
        currentPhase = (currentPhase + 1) % config.phases.length;
        phaseStartTime = Date.now();
        const newPhase = config.phases[currentPhase];
        
        if (newPhase.particleCount > particles.length) {
          for (let i = 0; i < newPhase.particleCount - particles.length; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            particles.push({
              theta, phi, radius: config.globe.radius, targetTheta: theta, targetPhi: phi, targetRadius: config.globe.radius,
              networkX: 0, networkY: 0, networkVx: 0, networkVy: 0,
              size: Math.random() * 2.5 + 1.5, opacity: 0, pulse: Math.random() * Math.PI * 2
            });
          }
        } else {
          particles = particles.slice(0, newPhase.particleCount);
        }

        const radius = config.globe.radius;
        particles.forEach(particle => {
          if (newPhase.particleMode === 'globe' || newPhase.particleMode === 'reform') {
            particle.targetRadius = radius;
          } else if (newPhase.particleMode === 'network') {
            particle.targetRadius = radius * (1.5 + Math.random() * 0.8);
            particle.networkVx = (Math.random() - 0.5) * 0.3;
            particle.networkVy = (Math.random() - 0.5) * 0.3;
          }
        });
      }
    };

    const drawGlobe = () => {
      const radius = config.globe.radius;
      const currentPhaseConfig = config.phases[currentPhase];

      globeCtx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);

      const targetOpacity = currentPhaseConfig.globeOpacity;
      globe.opacity += (targetOpacity - globe.opacity) * 0.05;

      globeCtx.strokeStyle = `rgba(4, 15, 45, ${0.15 * globe.opacity})`;
      globeCtx.lineWidth = 1;

      for (let lat = -80; lat <= 80; lat += 20) {
        globeCtx.beginPath();
        for (let lon = 0; lon <= 360; lon += 5) {
          const phi = (90 - lat) * Math.PI / 180;
          const theta = (lon + globe.rotation * 180 / Math.PI) * Math.PI / 180;
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          if (z > 0) {
            const screenX = globeCanvas.width / 2 + x;
            const screenY = globeCanvas.height / 2 + y;
            if (lon === 0) globeCtx.moveTo(screenX, screenY);
            else globeCtx.lineTo(screenX, screenY);
          }
        }
        globeCtx.stroke();
      }

      for (let lon = 0; lon < 360; lon += 20) {
        globeCtx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const phi = (90 - lat) * Math.PI / 180;
          const theta = (lon + globe.rotation * 180 / Math.PI) * Math.PI / 180;
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          if (z > 0) {
            const screenX = globeCanvas.width / 2 + x;
            const screenY = globeCanvas.height / 2 + y;
            if (lat === -90) globeCtx.moveTo(screenX, screenY);
            else globeCtx.lineTo(screenX, screenY);
          }
        }
        globeCtx.stroke();
      }

      const activeCount = currentPhaseConfig.activeLocations;
      globe.locations.forEach((loc, index) => {
        const theta = loc.theta + globe.rotation;
        const phi = loc.phi;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        if (z > 0) {
          const screenX = globeCanvas.width / 2 + x;
          const screenY = globeCanvas.height / 2 + y;
          const isActive = index < activeCount;
          loc.pulse += config.globe.pulseSpeed;
          const pulseAlpha = isActive ? 0.6 + Math.sin(loc.pulse) * 0.4 : 0.3 + Math.sin(loc.pulse) * 0.2;
          globeCtx.beginPath();
          globeCtx.arc(screenX, screenY, isActive ? 3 : 2, 0, Math.PI * 2);
          globeCtx.fillStyle = `rgba(4, 15, 45, ${pulseAlpha * globe.opacity})`;
          if (isActive) { globeCtx.shadowBlur = 10; globeCtx.shadowColor = config.colors.glow; }
          else { globeCtx.shadowBlur = 4; globeCtx.shadowColor = config.colors.glow; }
          globeCtx.fill();
          globeCtx.shadowBlur = 0;
        }
      });

      globe.rotation += config.globe.rotationSpeed;
    };

    const drawParticles = () => {
      const currentPhaseConfig = config.phases[currentPhase];
      particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      particles.forEach(particle => {
        particle.radius += (particle.targetRadius - particle.radius) * 0.05;
        particle.pulse += 0.05;
        if (particle.opacity < 1) particle.opacity += 0.02;

        let screenX, screenY, isVisible;

        if (currentPhaseConfig.particleMode === 'network') {
          const sphericalX = particle.radius * Math.sin(particle.phi) * Math.cos(particle.theta + globe.rotation);
          const sphericalY = particle.radius * Math.cos(particle.phi);
          particle.networkX += particle.networkVx;
          particle.networkY += particle.networkVy;
          screenX = particleCanvas.width / 2 + sphericalX + particle.networkX;
          screenY = particleCanvas.height / 2 + sphericalY + particle.networkY;
          isVisible = true;
        } else {
          particle.networkX *= 0.95;
          particle.networkY *= 0.95;
          const theta = particle.theta + globe.rotation;
          const x = particle.radius * Math.sin(particle.phi) * Math.cos(theta);
          const y = particle.radius * Math.cos(particle.phi);
          const z = particle.radius * Math.sin(particle.phi) * Math.sin(theta);
          screenX = particleCanvas.width / 2 + x;
          screenY = particleCanvas.height / 2 + y;
          isVisible = z > 0;
        }

        if (isVisible) {
          const pulseSize = particle.size * (1 + Math.sin(particle.pulse) * 0.2);
          particleCtx.beginPath();
          particleCtx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2);
          particleCtx.fillStyle = `rgba(4, 15, 45, ${particle.opacity * 0.8})`;
          particleCtx.shadowBlur = 6;
          particleCtx.shadowColor = config.colors.glow;
          particleCtx.fill();
          particleCtx.shadowBlur = 0;
        }
      });

      if (currentPhaseConfig.particleMode === 'network') {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = (particleCanvas.width / 2 + particles[i].radius * Math.sin(particles[i].phi) * Math.cos(particles[i].theta + globe.rotation) + particles[i].networkX) - (particleCanvas.width / 2 + particles[j].radius * Math.sin(particles[j].phi) * Math.cos(particles[j].theta + globe.rotation) + particles[j].networkX);
            const dy = (particleCanvas.height / 2 + particles[j].radius * Math.cos(particles[j].phi) + particles[j].networkY) - (particleCanvas.height / 2 + particles[i].radius * Math.cos(particles[i].phi) + particles[i].networkY);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
              particleCtx.beginPath();
              particleCtx.moveTo(particleCanvas.width / 2 + particles[i].radius * Math.sin(particles[i].phi) * Math.cos(particles[i].theta + globe.rotation) + particles[i].networkX, particleCanvas.height / 2 + particles[i].radius * Math.cos(particles[i].phi) + particles[i].networkY);
              particleCtx.lineTo(particleCanvas.width / 2 + particles[j].radius * Math.sin(particles[j].phi) * Math.cos(particles[j].theta + globe.rotation) + particles[j].networkX, particleCanvas.height / 2 + particles[j].radius * Math.cos(particles[j].phi) + particles[j].networkY);
              particleCtx.strokeStyle = `rgba(4, 15, 45, ${(1 - distance / 100) * 0.2})`;
              particleCtx.lineWidth = 1;
              particleCtx.stroke();
            }
          }
        }
      }
    };

    const animate = () => {
      updatePhase();
      drawGlobe();
      drawParticles();
      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    generateGlobeLocations();
    createParticles();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);
  const [gridState, setGridState] = useState({
    isVisible: false,
    icons: [false, false, false, false, false, false],
    titles: [false, false, false, false, false, false],
    descriptions: [false, false, false, false, false, false]
  });

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setGridState(prev => ({ ...prev, isVisible: true }));
    }, 5200);

    const iconTimers = [0, 2000, 4000, 6000, 8000, 10000].map((delay, index) => 
      setTimeout(() => {
        setGridState(prev => {
          const newIcons = [...prev.icons];
          newIcons[index] = true;
          return { ...prev, icons: newIcons };
        });
      }, 5200 + delay)
    );

    const titleTimers = [6000, 9000, 12000, 15000, 18000, 21000].map((delay, index) =>
      setTimeout(() => {
        setGridState(prev => {
          const newTitles = [...prev.titles];
          newTitles[index] = true;
          return { ...prev, titles: newTitles };
        });
      }, delay)
    );

    const descTimers = [6000, 9000, 12000, 15000, 18000, 21000].map((delay, index) =>
      setTimeout(() => {
        setGridState(prev => {
          const newDescs = [...prev.descriptions];
          newDescs[index] = true;
          return { ...prev, descriptions: newDescs };
        });
      }, delay)
    );

    return () => {
      clearTimeout(timer1);
      iconTimers.forEach(clearTimeout);
      titleTimers.forEach(clearTimeout);
      descTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
    <div className="flex flex-col pt-5 pl-5 pr-5 relative z-10" style={{ marginBottom: '200px' }}>
      {/* Mobile Header */}
      <div className="md:hidden flex flex-col">
        {/* Social Icons - Top Right */}
          <div className="flex items-center justify-end gap-3 pr-[20px] mobile-fly-in-left" style={{ animationDelay: '0.2s' }}>
            {socialLinks.map((link) => (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
                {renderSocialIcon(link.icon, 24, '#939393')}
              </a>
            ))}
          </div>
        {/* Logo + KMCQ GmbH - Left Side + Hamburger - Right Side */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 pl-[5px]">
            <div className="fade-in-3s">
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
            </div>
            <TypewriterText 
              text="KMCQ GmbH" 
              className="font-ubuntu text-white text-[24px] font-bold tracking-wide"
              delay={2000}
            />
          </div>
          <button 
            className="text-white p-2 mr-[15px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="flex flex-col items-end mt-4 space-y-4 z-50 pr-[20px]">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-ubuntu text-[20px] text-white hover:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex flex-col">
        <div className="flex flex-col md:flex-row items-start md:justify-between">
          <div className="flex items-center gap-2 pl-[5px] pt-[5px]">
            <div className="fade-in-3s">
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
            </div>
            <TypewriterText 
              text="KMCQ GmbH" 
              className="font-ubuntu text-white text-[24px] sm:text-[30px] md:text-[40px] font-bold tracking-wide translate-x-[3px] md:translate-y-[35px]"
              delay={2000}
            />
          </div>
          <div className="flex flex-col items-end pt-[10px] md:pt-[50px] pr-[20px] mr-[-1px]">
            <div className="flex items-center gap-[55px] pb-[5px] md:pb-[10px] mt-[-17px] md:mt-[-17px]">
              <form action="https://www.google.com/search" method="get" target="_blank" className="hidden md:flex items-center slide-in-left-3s" style={{ width: 171, height: 30 }}>
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
              <div className="flex items-center gap-[17px] slide-in-left-4s">
                {socialLinks.map((link) => (
                  <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" style={{ display: 'flex' }}>
                    {renderSocialIcon(link.icon, 30, '#939393')}
                  </a>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-[5px] md:gap-[45px] mt-[17px]">
              {menuItems.map((item, index) => (
                <div 
                  key={item.label}
                  className="fade-in-4s px-2 py-1 rounded"
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    backgroundColor: hoveredIndex === index ? 'white' : 'transparent'
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link
                    href={item.href}
                    className="font-ubuntu text-[17px] transition-colors"
                    style={{ color: hoveredIndex === index ? 'black' : 'white' }}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center" style={{ marginTop: '340px' }}>
        <h1 className="font-ubuntu text-white text-[35px] sm:text-[50px] md:text-[70px] font-bold text-center tracking-wide">
          <TypewriterText 
            text={heroTitle}
            delay={3000}
          />
        </h1>
        <p className="font-ubuntu text-white text-[21px] text-center mt-4">
          <TypewriterText 
            text={heroSubtitle}
            delay={5160}
          />
        </p>
      </div>
    </div>

    {/* Footer Grid Container - Full Width */}
    <div 
      className="w-full p-0 relative z-50" 
      style={{ 
        marginTop: '340px', 
        marginBottom: '0px', 
        paddingTop: '20px', 
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        borderTop: '20px solid #040f2d',
        backgroundColor: '#ffffff',
        opacity: 0,
        animation: 'fadeIn 2s ease-in-out forwards',
        animationDelay: '5.2s'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '15px' }}>
        {features.map((f, i) => (
          <div key={i} className="p-4 flex flex-col items-center justify-center" style={{ backgroundColor: '#c5c5c5', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)', border: '1px solid black' }}>
            {gridState.icons[i] && (
              <div className="scroll-fade-in" style={{ opacity: 0, animation: 'fadeIn 0.5s forwards' }}>
                {iconMap[f.icon] || <MdSettings size={70} color="#040f2d" />}
              </div>
            )}
            {gridState.titles[i] && <span style={{ color: '#191919', marginTop: '10px', textAlign: 'center', fontWeight: 'bold' }}><TypewriterText text={f.title} delay={0} /></span>}
            {gridState.descriptions[i] && <div style={{ color: '#040f2d', marginTop: '10px', textAlign: 'left', fontSize: '14px' }}><TypewriterText text={f.content.replace(/<[^>]*>/g, '')} delay={0} /></div>}
          </div>
        ))}
      </div>
    </div>

    {/* Products Section - Full Width */}
    <div 
      id="products"
      className="products-section w-full p-0 relative z-40" 
      style={{ 
        marginTop: '20px', 
        marginBottom: '0px', 
        paddingTop: '40px', 
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 -20px 0 0 #ffffff'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <span 
          style={{ 
            color: '#040f2d', 
            fontSize: '37px', 
            fontWeight: 'bold', 
            fontFamily: 'Arial, Helvetica, sans-serif',
            textAlign: 'center',
            textDecoration: 'none'
          }}
        >
          <TypewriterText text="Our Products" delay={1} />
        </span>
      </div>
    </div>

    {/* Hosting Services Section - Full Width */}
    <div 
      className="hosting-services-section w-full p-0 relative z-40" 
      style={{ 
        marginTop: '20px', 
        marginBottom: '0px', 
        paddingTop: '40px', 
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        backgroundImage: 'url("/background_images/bg1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: '0 -20px 0 0 #ffffff'
      }}
    >
      <div className="flex flex-col md:flex-row" style={{ gap: '20px' }}>
        {/* First Column - Image */}
        <div className="w-full md:w-1/2 flex items-center justify-end flex-shrink-0">
          <div style={{ height: 'auto', opacity: 0, animation: 'flyInFromLeft 1s ease-out forwards' }}>
            <Image 
              src="/cloud-infrastructure_b.png"
              alt="Computing Infrastructure"
              width={517}
              height={0}
              style={{ width: '517px', height: 'auto', borderRadius: '10px' }}
              key="cloud-infra"
            />
          </div>
        </div>
        
        {/* Second Column - Dynamic Products */}
        <div className="hosting-col-77 flex flex-col" style={{ gap: '20px' }}>
          {products.map((p, i) => (
            <Link key={i} href={p.url || '#'} style={{ textDecoration: 'none' }}>
              <div className="flex items-center" style={{
                padding: '25px', backgroundColor: hoveredProduct === i ? '#000616' : '#ededed',
                borderRadius: '10px', borderTopWidth: '25px', borderBottomWidth: '25px', border: '1px solid black',
                opacity: 0, animation: 'flyInFromRight 1s ease-out forwards', animationDelay: `${i * 0.2}s`,
                marginTop: '20px', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
                transition: 'background-color 0.3s ease',
                cursor: 'pointer',
              }}
                onMouseEnter={() => setHoveredProduct(i)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {renderProductIcon(p.icon, hoveredProduct === i ? '#ffffff' : '#040f2d')}
                <span style={{
                  color: hoveredProduct === i ? '#ffffff' : '#040f2d', fontSize: '24px', fontWeight: 'bold',
                  marginLeft: '15px', fontFamily: 'Arial, Helvetica, sans-serif',
                  transition: 'color 0.3s ease',
                }}>
                  {p.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>

    {/* Reviews Section - Full Width */}
    <div 
      id="reviews"
      className="reviews-section w-full p-0 relative z-40" 
      style={{ 
        marginTop: '20px', 
        marginBottom: '0px', 
        paddingTop: '40px', 
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 -20px 0 0 #ffffff'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <span 
          style={{ 
            color: '#040f2d', 
            fontSize: '37px', 
            fontWeight: 'bold', 
            fontFamily: 'Arial, Helvetica, sans-serif',
            textAlign: 'center',
            textDecoration: 'none'
          }}
        >
          <TypewriterText text="Customer Reviews" delay={1} />
        </span>
      </div>
    </div>

    {/* Next Reviews Carousel - Rotating Slide */}
    <div 
      ref={carouselRef}
      className="next-reviews-carousel w-full p-0 relative z-40"
      onMouseEnter={() => setCarouselDirection('paused')}
      onMouseLeave={() => setCarouselDirection('left')}
      onMouseMove={(e) => {
        if (!carouselRef.current) return;
        const rect = carouselRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const leftPercent = (x / width) * 100;
        
        if (leftPercent < 40) {
          setCarouselDirection('right');
        } else if (leftPercent > 60) {
          setCarouselDirection('left');
        } else {
          setCarouselDirection('paused');
        }
      }}
      style={{ 
        marginTop: '20px', 
        marginBottom: '20px', 
        paddingTop: '40px', 
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 -20px 0 0 #ffffff, 0 20px 0 0 #ffffff'
      }}
    >
      <div className="carousel-container" style={{ 
        display: 'flex', 
        flexWrap: 'nowrap',
        overflow: 'hidden',
        width: '100%',
        position: 'relative'
      }}>
        <style jsx>{`
          .carousel-track {
            display: flex;
            will-change: transform;
          }
          @media (max-width: 768px) {
            .review-cell {
              min-width: calc(100vw - 40px) !important;
              max-width: calc(100vw - 40px) !important;
            }
          }
        `}</style>
        <div 
          ref={carouselTrackRef}
          className="carousel-track"
          style={{
            transform: `translateX(-${carouselPosition * 100}%)`,
            transition: 'transform 0.1s linear'
          }}
        >
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="review-cell"
              style={{ 
                minWidth: '677px', 
                maxWidth: '677px',
                marginTop: '5px',
                marginBottom: '5px',
                marginLeft: '20px',
                marginRight: '20px',
                padding: '30px 35px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #000000',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', marginRight: '15px' }}>
                  <Image 
                    src={`/reviews_images/${review.image}`}
                    alt={review.name}
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#040f2d', fontSize: '18px', fontWeight: 'bold' }}>{review.name}</span>
                  <span style={{ color: '#FFD700', fontSize: '24px', lineHeight: '1' }}>{'★'.repeat(review.rating || 5)}</span>
                </div>
              </div>
              <p style={{ color: '#555555', fontSize: '15px', lineHeight: '1.6', marginBottom: '15px', marginTop: '20px', fontStyle: 'italic' }}>&ldquo;{review.text}&rdquo;</p>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '12px' }}>
                <span style={{ color: '#040f2d', fontSize: '14px', fontWeight: 'bold', display: 'block' }}>{review.role}</span>
                <span style={{ color: '#040f2d', fontSize: '13px', fontWeight: 'bold' }}>{review.industry}</span>
              </div>
            </div>
          ))}
          {/* Duplicate for continuous loop */}
          {reviews.map((review, index) => (
            <div 
              key={`dup-${index}`}
              className="review-cell"
              style={{ 
                minWidth: '677px', 
                maxWidth: '677px',
                marginTop: '5px',
                marginBottom: '5px',
                marginLeft: '20px',
                marginRight: '20px',
                padding: '30px 35px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #000000',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', marginRight: '15px' }}>
                  <Image 
                    src={`/reviews_images/${review.image}`}
                    alt={review.name}
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#040f2d', fontSize: '18px', fontWeight: 'bold' }}>{review.name}</span>
                  <span style={{ color: '#FFD700', fontSize: '24px', lineHeight: '1' }}>{'★'.repeat(review.rating || 5)}</span>
                </div>
              </div>
              <p style={{ color: '#555555', fontSize: '15px', lineHeight: '1.6', marginBottom: '15px', marginTop: '20px', fontStyle: 'italic' }}>&ldquo;{review.text}&rdquo;</p>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '12px' }}>
                <span style={{ color: '#040f2d', fontSize: '14px', fontWeight: 'bold', display: 'block' }}>{review.role}</span>
                <span style={{ color: '#040f2d', fontSize: '13px', fontWeight: 'bold' }}>{review.industry}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* About Us Section */}
    <div 
      id="about-us"
      className="about-us-section w-full p-0 relative z-40"
      style={{ 
        marginTop: '0px', 
        marginBottom: '0px', 
        paddingTop: '40px', 
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        backgroundColor: '#ffffff'
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <span 
          style={{ 
            color: '#040f2d', 
            fontSize: '37px', 
            fontWeight: 'bold', 
            fontFamily: 'Arial, Helvetica, sans-serif',
            textAlign: 'center',
            textDecoration: 'none'
          }}
        >
          <TypewriterText text="About Us" delay={1} />
        </span>
      </div>
    </div>

    {/* About Details Section */}
    <div 
      className="about-details-section w-full p-0 relative z-40"
      style={{ 
        marginTop: '0px', 
        marginBottom: '0px', 
        paddingTop: '40px', 
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
        backgroundImage: 'url("/background_images/aboutus_section_bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <style jsx>{`
        @media (max-width: 768px) {
          .about-details-container {
            flex-direction: column !important;
          }
          .about-details-first-col {
            width: 100% !important;
          }
          .about-details-second-col {
            width: 100% !important;
          }
        }
      `}</style>
      <div className="about-details-container" style={{ display: 'flex', flexDirection: 'row', gap: '40px', justifyContent: 'flex-end', alignItems: 'center' }}>
          {/* First Column */}
          <div className="about-details-first-col" style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end' }}>
            {(() => {
              const about = aboutSections.find(s => s.section_name === 'about');
              const mission = aboutSections.find(s => s.section_name === 'mission');
              const vision = aboutSections.find(s => s.section_name === 'vision');
              const rows: { title: string | null; content: string; delay: number }[] = [];
              if (about) rows.push({ title: null, content: about.content, delay: 0 });
              if (mission) rows.push({ title: mission.title, content: mission.content, delay: 1000 });
              if (vision) rows.push({ title: vision.title, content: vision.content, delay: 2000 });
              return rows.map((row, i) => (
                <div key={i} style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', width: row.title === null ? '100%' : undefined }}>
                  <p style={{ color: '#040f2d', fontSize: '15px', lineHeight: '1.8', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {row.title && <><strong>{row.title}</strong><br /><br /></>}
                    <TypewriterText text={row.content.replace(/<[^>]*>/g, '')} delay={row.delay} />
                  </p>
                </div>
              ));
            })()}
          </div>
        {/* Second Column */}
        <div className="about-details-second-col" style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <canvas id="hero-globe-canvas" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            <canvas id="particle-network" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
          </div>
        </div>
      </div>
    </div>

    {/* Footer Section */}
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
      {/* First Row - Dynamic Columns */}
      <div className="footer-first-row" style={{ display: 'flex', flexDirection: 'row', gap: '40px', marginBottom: '40px', width: '65%', margin: '0 auto 40px auto' }}>
        {sections.filter(s => s.section_key !== 'legal').map(s => (
          <div key={s.section_key} style={{ flex: 1, padding: '20px' }}>
            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>{getSectionLabel(s.section_key)}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {footerItems.filter(i => i.section === s.section_key).map(item => (
                <Link key={item.label} href={item.href}
                  target={item.label === 'Our Blog' ? '_blank' : undefined}
                  rel={item.label === 'Our Blog' ? 'noopener noreferrer' : undefined}
                  className="footer-link" style={{ color: '#9d9d9d', fontSize: '14px', textDecoration: 'none' }}>{item.label}</Link>
              ))}
            </div>
          </div>
        ))}
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
            <span style={{ color: '#9d9d9d', fontSize: '14px' }}>support@kmcq-gmbh.com</span>
            <span style={{ color: '#9d9d9d', fontSize: '14px' }}>
              {footerItems.filter(i => i.section === 'legal').map((item, idx, arr) => (
                <span key={item.label}>{idx > 0 && <span> | </span>}<Link href={item.href} className="footer-link" style={{ color: '#9d9d9d', textDecoration: 'none' }}>{item.label}</Link></span>
              ))}
            </span>
          </div>
        </div>
        {/* Second Column - Empty */}
        <div className="footer-second-col-empty" style={{ flex: 0.9 }}></div>
        {/* Third Column - Social Media */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', padding: '20px', paddingRight: '50px' }}>
            {socialLinks.map((link) => (
              <Link key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="footer-link">{renderSocialIcon(link.icon, 24, '#9d9d9d')}</Link>
            ))}
          </div>
      </div>
    </div>
    </>
  );
}
