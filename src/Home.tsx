import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion, AnimatePresence, useScroll,
  useInView, useMotionValue, useSpring
} from "framer-motion";
import {
  Award, ShieldCheck, Zap, Truck, Phone, MessageCircle, Menu, X, Check,
  Briefcase, Car, RotateCw, Battery, Factory, Beaker, Info, Mail, ExternalLink,
  ChevronUp
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { products } from "./data/products";
import { categoryImages } from "./data/categoryImages";

const WhatsAppLink = "https://wa.me/994503791806";

function useCountUp(end: number, duration: number, startCounting: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, startCounting]);
  return count;
}

function AnimatedBadge({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wider mb-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/10 to-transparent animate-shimmer" />
      <Zap className="w-3.5 h-3.5 relative z-10" />
      <span className="relative z-10">{text}</span>
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-teal-400 z-[100] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md border border-primary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function CustomCursor() {
  const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);
  const springX = useSpring(cursorX, { stiffness: 150, damping: 15 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    if (!isDesktop) return;
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const onOver = () => setHovered(true);
    const onOut = () => setHovered(false);
    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button, [role=button], .card-hover").forEach(el => {
      el.addEventListener("mouseenter", onOver);
      el.addEventListener("mouseleave", onOut);
    });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.querySelectorAll("a, button, [role=button], .card-hover").forEach(el => {
        el.removeEventListener("mouseenter", onOver);
        el.removeEventListener("mouseleave", onOut);
      });
    };
  }, [cursorX, cursorY, isDesktop]);

  if (!isDesktop) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        animate={{ scale: hovered ? 1.5 : 1 }}
        className="w-6 h-6 rounded-full border-2 border-teal-400 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        {hovered && (
          <span className="text-[8px] font-bold text-teal-400 uppercase tracking-widest">Bax</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-wide">{children}</h2>
      {subtitle && <p className="text-muted-foreground mt-4 text-lg">{subtitle}</p>}
      <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mx-auto mt-6 rounded-full" />
    </motion.div>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth <= 768) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / centerY * -10);
    setRotateY((x - centerX) / centerX * 10);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.3 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={className}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative overflow-hidden rounded-lg"
      >
        {children}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(0,200,255,${glare.opacity}) 0%, transparent 60%)`,
            opacity: glare.opacity,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

function CountUpCard({ value, label, suffix = "", delay = 0 }: { value: number; label: string; suffix?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(value, 2000, isInView);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setShowProgress(true), delay * 1000 + 500);
      return () => clearTimeout(t);
    }
  }, [isInView, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="bg-card border border-card-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
    >
      <div className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-2">
        {isInView ? count : 0}{suffix}
      </div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">{label}</div>
      <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={showProgress ? { width: "100%" } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
        />
      </div>
    </motion.div>
  );
}

function FloatingStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 + delay }}
      className="bg-card/80 backdrop-blur-md border border-card-border rounded-lg px-4 py-3 text-center"
      style={{
        animation: `float 3s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <div className="font-display text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</div>
    </motion.div>
  );
}

function BrandsTicker({ brandRow1, brandRow2 }: { brandRow1: string[]; brandRow2: string[] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="py-8 bg-card/80 border-y border-card-border overflow-hidden relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-4">
        <div
          className="flex gap-12 whitespace-nowrap animate-marquee"
          style={{ animationPlayState: isHovered ? "paused" : "running" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 font-display text-3xl md:text-5xl text-muted-foreground/20 uppercase tracking-widest shrink-0">
              {brandRow1.map((brand, j) => (
                <span key={j} className="hover:text-primary/30 transition-colors duration-300">{brand}</span>
              ))}
            </div>
          ))}
        </div>
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{
            animation: `marquee 25s linear infinite reverse`,
            animationPlayState: isHovered ? "paused" : "running",
          }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 font-display text-2xl md:text-4xl text-muted-foreground/15 uppercase tracking-widest shrink-0">
              {brandRow2.map((brand, j) => (
                <span key={j} className="hover:text-teal-400/30 transition-colors duration-300">{brand}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("Hamısı");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 50));
    return () => unsub();
  }, [scrollY]);

  const filters = [
    "Hamısı", "Yigit Aku", "Perge Aku", "Yuras", "Bülbül", "Klas",
    "Avtomobil", "Yatıq (Y)", "AGM", "EFB", "GEL", "Golf", "Traksiyon",
    "Ağır Texnika", "Marin", "6V", "8V", "12V"
  ];

  const filteredProducts = activeFilter === "Hamısı"
    ? products
    : products.filter(p => {
        if (activeFilter === "Yigit Aku") return p.filterTags.includes("yigit");
        if (activeFilter === "Perge Aku") return p.filterTags.includes("perge");
        if (activeFilter === "Yuras") return p.filterTags.includes("yuras");
        if (activeFilter === "Bülbül") return p.filterTags.includes("bulbul");
        if (activeFilter === "Klas") return p.filterTags.includes("klas");
        if (activeFilter === "Avtomobil") return p.filterTags.includes("avtomobil");
        if (activeFilter === "Yatıq (Y)") return p.filterTags.includes("yatiq");
        if (activeFilter === "AGM") return p.filterTags.includes("agm");
        if (activeFilter === "EFB") return p.filterTags.includes("efb");
        if (activeFilter === "GEL") return p.filterTags.includes("gel");
        if (activeFilter === "Golf") return p.filterTags.includes("golf");
        if (activeFilter === "Traksiyon") return p.filterTags.includes("traksiyon");
        if (activeFilter === "Ağır Texnika") return p.filterTags.includes("agir");
        if (activeFilter === "Marin") return p.filterTags.includes("marin");
        if (activeFilter === "6V") return p.filterTags.includes("6v");
        if (activeFilter === "8V") return p.filterTags.includes("8v");
        if (activeFilter === "12V") return p.filterTags.includes("12v");
        return true;
      });

  const [activeNav, setActiveNav] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      const sections = [
        { id: "hero", offset: 0 },
        { id: "kataloq", offset: 300 },
        { id: "haqqinda", offset: 300 },
        { id: "elaqe", offset: 300 },
      ];
      const scrollPos = window.scrollY + 150;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && scrollPos >= el.offsetTop - 200) {
          setActiveNav(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }, []);

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case "Yigit Aku": return "text-[#00c8ff]";
      case "Perge Aku": return "text-[#22c55e]";
      case "Yuras": return "text-[#ff6b00]";
      default: return "text-primary";
    }
  };

  const getProductCount = (tag: string) => {
    return products.filter(p => p.filterTags.includes(tag)).length;
  };

  const categoryCards = [
    { title: "Avtomobil Akkumulyatorları", tag: "avtomobil", icon: Car, img: categoryImages.avtomobil },
    { title: "Yatıq (Y) Seriya", tag: "yatiq", icon: RotateCw, img: categoryImages.yatiq },
    { title: "AGM Start-Stop", tag: "agm", icon: Zap, img: categoryImages.agm },
    { title: "EFB Texnologiyası", tag: "efb", icon: Battery, img: categoryImages.efb },
    { title: "Golf / Traksiyon", tag: "golf", icon: Truck, img: categoryImages.golf },
    { title: "GEL Akkumulyatorlar", tag: "gel", icon: Beaker, img: categoryImages.gel },
    { title: "Ağır Texnika", tag: "agir", icon: Truck, img: categoryImages.agir },
    { title: "Sənaye / Industrial", tag: "industrial", icon: Factory, img: categoryImages.sanaye }
  ];

  const brandLinks = [
    { name: "Yigit Aku", url: "https://www.yigitaku.com", color: "#00c8ff", glow: "rgba(0,200,255,0.15)" },
    { name: "Bülbül Battery", url: "https://www.bulbulaku.com.tr/en", color: "#00c8ff", glow: "rgba(0,200,255,0.15)" },
    { name: "Perge Aku", url: "https://www.bulbulaku.com.tr/perge-aku/", color: "#22c55e", glow: "rgba(34,197,94,0.15)" },
    { name: "Yuras", url: "https://yurasaku.net", color: "#ff6b00", glow: "rgba(255,107,0,0.15)" }
  ];

  const headingWords = ["Güc", "Ki", "Heç", "Vaxt", "Bitməz"];

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const wordVariants = {
    hidden: { y: 60, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const brandRow1 = ["Yigit Aku", "Bülbül Battery", "Perge Aku", "Klas Aku", "Yuras", "Yigit Aku", "Bülbül Battery", "Perge Aku", "Klas Aku", "Yuras"];
  const brandRow2 = ["Perge Aku", "Klas Aku", "Yuras", "Yigit Aku", "Bülbül Battery", "Perge Aku", "Klas Aku", "Yuras", "Yigit Aku", "Bülbül Battery"];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-teal-200">
      <ScrollProgress />
      <CustomCursor />

      {/* NAVBAR */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-background/70 border-b border-white/10 shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <motion.div
            className="font-display text-2xl tracking-widest flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.02 }}
          >
            <motion.span
              className="text-2xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 0 6px rgba(0,200,255,0.5))" }}
            >
              ⚡
            </motion.span>
            <img src="https://i.ibb.co/Z6W4mMTB/logo-dizayn-aku.png" alt="Turkaz Enerji" className="h-9 w-auto object-contain" />
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium uppercase tracking-wider">
            {[
              { id: "hero", label: "Ana səhifə" },
              { id: "kataloq", label: "Kataloq" },
              { id: "haqqinda", label: "Haqqında" },
              { id: "elaqe", label: "Əlaqə" },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="relative px-4 py-2 rounded-md hover:text-primary transition-colors"
              >
                {link.label}
                {activeNav === link.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
            <a
              href={WhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-md font-display tracking-wider text-lg transition-all hover:shadow-lg hover:shadow-[#25D366]/30"
            >
              <FaWhatsapp className="w-5 h-5" />
              Sifariş et
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative w-12 h-12 flex items-center justify-center text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={mobileMenuOpen ? "open" : "closed"}
              className="flex flex-col items-center justify-center gap-1.5"
            >
              <motion.span
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 4.5 } }}
                className="block w-6 h-0.5 bg-current rounded-full"
              />
              <motion.span
                variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                className="block w-6 h-0.5 bg-current rounded-full"
              />
              <motion.span
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -4.5 } }}
                className="block w-6 h-0.5 bg-current rounded-full"
              />
            </motion.div>
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-card/95 backdrop-blur-xl border-r border-white/10 z-50 md:hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <span className="text-xl font-display tracking-widest flex items-center gap-2">
                    ⚡
                    <img src="https://i.ibb.co/Z6W4mMTB/logo-dizayn-aku.png" alt="Turkaz Enerji" className="h-8 w-auto object-contain" />
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-white p-2">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 flex flex-col p-6 gap-3">
                  {[
                    { id: "hero", label: "Ana səhifə" },
                    { id: "kataloq", label: "Kataloq" },
                    { id: "haqqinda", label: "Haqqında" },
                    { id: "elaqe", label: "Əlaqə" },
                  ].map((link, i) => (
                    <motion.button
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.3 }}
                      onClick={() => scrollTo(link.id)}
                      className="text-left text-2xl font-display text-white py-3 px-4 rounded-lg hover:bg-white/5 transition-colors tracking-wide"
                    >
                      {link.label}
                    </motion.button>
                  ))}
                </div>

                <div className="p-6 border-t border-white/5">
                  <div className="flex gap-3 mb-4">
                    <button className="px-4 py-2 text-sm font-semibold rounded-md bg-primary/20 text-primary border border-primary/30">AZ</button>
                    <button className="px-4 py-2 text-sm font-semibold rounded-md bg-white/5 text-muted-foreground border border-white/10">EN</button>
                    <button className="px-4 py-2 text-sm font-semibold rounded-md bg-white/5 text-muted-foreground border border-white/10">RU</button>
                  </div>
                  <a
                    href={WhatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-md font-display tracking-wider text-lg"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    Sifariş et
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-16 md:pt-32 md:pb-32 px-4 overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-cyan-500/8 to-teal-500/8 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-teal-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          <AnimatedBadge text="🏆 Azərbaycanın №1 Akkumulyator Platforması" />

          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display leading-[0.9] text-white mb-6 uppercase tracking-tight"
          >
            {headingWords.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="inline-block mr-[0.15em]"
              >
                {word}
                {i === 0 && <br className="md:hidden" />}
              </motion.span>
            ))}
            <br className="hidden md:block" />
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.75 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300"
            >
              Enerji Həlli
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            <span className="block">Azərbaycanın ən böyük akkumulyator platforması</span>
            <span className="block text-sm md:text-base mt-1 text-muted-foreground/80">
              17 premium brend · 58+ model · Rəsmi distribütor · 1 il zəmanət
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <motion.button
              onClick={() => scrollTo("kataloq")}
              whileHover={{ scale: 1.04, backgroundColor: "rgba(0,200,255,0.9)" }}
              whileTap={{ scale: 0.96 }}
              className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-display text-xl px-8 py-4 rounded-sm uppercase tracking-wider group"
            >
              <span className="relative z-10">Kataloqa Bax</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
            </motion.button>
            <motion.a
              href={WhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 font-display text-xl px-8 py-4 rounded-sm flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp
            </motion.a>
          </motion.div>

          {/* Floating Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mt-16 md:mt-24 w-full max-w-lg mx-auto">
            <FloatingStat value="58+" label="Model" delay={0} />
            <FloatingStat value="17" label="Brend" delay={1} />
            <FloatingStat value="100+" label="Ölkə" delay={2} />
          </div>
        </div>
      </section>

      {/* BRANDS TICKER */}
      <BrandsTicker brandRow1={brandRow1} brandRow2={brandRow2} />

      {/* MAIN BRAND CARDS WITH 3D TILT */}
      <section className="py-20 px-4 container mx-auto">
        <SectionTitle subtitle="Türkiyənin ən etibarlı akkumulyator istehsalçıları">
          Premium Brendlər
        </SectionTitle>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {[
            { name: "Yiğit Aku", desc: "Yüksək keyfiyyətli start-stop akkumulyatorları", color: "#00c8ff" },
            { name: "Bülbül Battery", desc: "Etibarlı və uzun ömürlü enerji həlləri", color: "#00c8ff" },
            { name: "Perge Aku", desc: "Premiyum sinif akkumulyator texnologiyası", color: "#22c55e" },
            { name: "Klas Aku", desc: "Klassik və etibarlı akkumulyator seriyası", color: "#f59e0b" },
            { name: "Yuras", desc: "Sənaye və dənizçilik akkumulyatorları", color: "#ff6b00" },
          ].map((brand, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TiltCard>
                <div
                  className="card-hover bg-card border border-card-border rounded-lg p-6 text-center group cursor-default"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${brand.color}15`, borderColor: `${brand.color}30` }}
                  >
                    ⚡
                  </motion.div>
                  <h3
                    className="font-display text-xl md:text-2xl text-white uppercase tracking-wider mb-2"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    {brand.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed" style={{ transform: "translateZ(20px)" }}>
                    {brand.desc}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORY VISUAL GRID */}
      <section className="py-16 px-4 container mx-auto">
        <SectionTitle subtitle="Məhsullarımızı kateqoriyalar üzrə kəşf edin">
          Kateqoriyalar
        </SectionTitle>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryCards.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => {
                let filterToSet = cat.title;
                if (cat.tag === "avtomobil") filterToSet = "Avtomobil";
                else if (cat.tag === "yatiq") filterToSet = "Yatıq (Y)";
                else if (cat.tag === "agm") filterToSet = "AGM";
                else if (cat.tag === "efb") filterToSet = "EFB";
                else if (cat.tag === "golf") filterToSet = "Golf";
                else if (cat.tag === "gel") filterToSet = "GEL";
                else if (cat.tag === "agir") filterToSet = "Ağır Texnika";
                else if (cat.tag === "industrial") filterToSet = "Hamısı";
                setActiveFilter(filterToSet);
                scrollTo("kataloq");
              }}
              className="relative h-48 md:h-56 rounded-lg overflow-hidden cursor-pointer group"
            >
              <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 group-hover:brightness-110 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300 rounded-lg" />
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_10px_rgba(0,200,255,0.5)]">
                <cat.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-display text-xl md:text-2xl text-white uppercase leading-none mb-2">{cat.title}</h3>
                <span className="inline-block px-2 py-0.5 bg-background/80 backdrop-blur-sm text-muted-foreground text-xs font-semibold rounded uppercase tracking-wider">
                  {getProductCount(cat.tag)} məhsul
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICE NOTICE BANNER */}
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-[1px] rounded-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-lg" />
          <div className="relative bg-[#0a1628]/90 backdrop-blur-sm rounded-lg p-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <Briefcase className="w-6 h-6 text-orange-500 shrink-0" />
            <p className="text-white font-medium text-sm md:text-base tracking-wide">
              Qiymətlər korporativ və endirimlidir • <span className="text-cyan-400">ƏDV daxil deyil</span> • Ətraflı məlumat və fərdi təklif üçün bizimlə əlaqə saxlayın
            </p>
          </div>
        </motion.div>
      </div>

      {/* KATALOQ */}
      <section id="kataloq" className="py-12 px-4 container mx-auto">
        <SectionTitle subtitle="Bütün məhsullarımızı kəşf edin">
          Məhsul Kataloqu
        </SectionTitle>

        {/* Filter Tabs */}
        <div className="relative mb-12">
          <div className="flex overflow-x-auto md:flex-wrap pb-2 justify-start md:justify-center gap-2 scrollbar-hide snap-x">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative snap-start shrink-0 px-4 py-2 rounded-sm text-sm font-semibold uppercase tracking-wider transition-colors duration-200 whitespace-nowrap min-w-[80px] ${
                  activeFilter === filter
                    ? "text-primary"
                    : "bg-card text-muted-foreground border border-card-border hover:border-primary/50 hover:text-white"
                }`}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="filter-indicator"
                    className="absolute inset-0 bg-primary/20 border border-primary shadow-[0_0_15px_rgba(0,200,255,0.4)] rounded-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => {
              let imgSrc: string | null = null;
              if (product.filterTags.includes("agm")) imgSrc = categoryImages.agm;
              else if (product.filterTags.includes("gel")) imgSrc = categoryImages.gel;
              else if (product.filterTags.includes("golf")) imgSrc = categoryImages.golf;
              else if (product.filterTags.includes("agir")) imgSrc = categoryImages.agir;
              else if (product.filterTags.includes("avtomobil")) imgSrc = categoryImages.avtomobil;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="group relative bg-card border border-card-border rounded-lg flex flex-col transition-all duration-200 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,200,255,0.15)] overflow-hidden"
                >
                  {imgSrc && (
                    <div className="h-40 w-full relative overflow-hidden">
                      <img src={imgSrc} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="absolute top-4 right-4 bg-muted/80 backdrop-blur text-xs px-2 py-1 rounded font-bold uppercase tracking-wider text-white">
                      {product.category}
                    </div>

                    <div className="mb-4 mt-2">
                      <div className={`font-display text-xl tracking-wider mb-1 ${getBrandColor(product.brand)}`}>{product.brand}</div>
                      <h3 className="font-display text-2xl text-white uppercase leading-tight">{product.name}</h3>
                    </div>

                    <div className="text-muted-foreground text-sm font-medium mb-6 bg-background/50 p-3 rounded border border-border">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-secondary" />
                        {product.specs}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="font-display text-5xl text-secondary">{product.price}</span>
                        <span className="font-display text-2xl text-secondary">₼</span>
                      </div>
                      <div className="text-muted-foreground text-xs mb-4">ƏDV xaric</div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] bg-[#25D366]/10 px-2.5 py-1 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                          1 il zəmanət
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-full opacity-80">
                          Korporativ qiymət
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/994503791806?text=${encodeURIComponent("Salam, " + product.name + " - " + product.price + " AZN (ƏDV xaric) haqqında məlumat almaq istəyirəm")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/50 transition-colors duration-200 py-3 rounded font-display tracking-widest text-lg uppercase"
                      >
                        <FaWhatsapp className="w-5 h-5" />
                        Sifariş
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center bg-card border border-card-border rounded-lg max-w-2xl mx-auto"
            >
              <Info className="w-12 h-12 text-primary mb-4 opacity-50" />
              <h3 className="font-display text-2xl text-white tracking-widest uppercase mb-2">Məhsul tapılmadı</h3>
              <p className="text-muted-foreground">
                Bu marka üçün məhsul tezliklə əlavə olunacaq. Zəhmət olmasa əlaqə saxlayın.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* HAQQINDA */}
      <section id="haqqinda" className="py-24 bg-card/50 border-y border-card-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase mb-6">Haqqımızda</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              "Turkaz Enerji" MMC — Türkiyənin ən etibarlı və qabaqcıl akkumulyator istehsalçılarının Azərbaycandakı rəsmi və eksklüziv distributorudur. Biz müştərilərimizə yalnız orijinal, beynəlxalq standartlara cavab verən və hər bir şəraitdə mükəmməl performans göstərən məhsullar təqdim edirik. Məqsədimiz ölkənin enerji tələbatını ən keyfiyyətli həllərlə təmin etməkdir.
            </p>
          </motion.div>

          {/* Stats with CountUp */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <CountUpCard value={17} label="Brend" suffix="+" delay={0} />
            <CountUpCard value={100} label="Ölkə" suffix="+" delay={0.15} />
            <CountUpCard value={1} label="İl Zəmanət" delay={0.3} />
            <CountUpCard value={24} label="B2B Dəstək" suffix="/7" delay={0.45} />
          </div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-display text-2xl md:text-3xl mb-8 uppercase text-white"
          >
            Təmsil Etdiyimiz Brendlər
          </motion.h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {brandLinks.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <a
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-hover bg-card border border-card-border p-6 rounded-lg text-center transition-all duration-300 group flex flex-col items-center justify-center gap-2"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = brand.color;
                    e.currentTarget.style.boxShadow = `0 0 20px ${brand.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div className="font-display text-xl md:text-2xl text-white transition-colors">
                    {brand.name}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-white transition-colors" />
                </a>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-card-border p-6 rounded-lg text-center cursor-default hover:border-primary/30 transition-all flex items-center justify-center"
            >
              <div className="font-display text-xl md:text-2xl text-muted-foreground">Klas Aku</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NIYE BIZ */}
      <section className="py-24 px-4 container mx-auto">
        <SectionTitle subtitle="Niyə məhz bizi seçməlisiniz?">
          Niyə Bizi Seçməlisiniz?
        </SectionTitle>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Award, title: "Orijinal Məhsul", desc: "Türkiyənin rəsmi istehsalçılarından birbaşa" },
            { icon: ShieldCheck, title: "1 İl Zəmanət", desc: "Bütün məhsullara rəsmi zəmanət verilir" },
            { icon: Zap, title: "Geniş Çeşid", desc: "AGM, EFB, GEL, Golf, Traksiyon və daha çox" },
            { icon: Truck, title: "Sürətli Çatdırılma", desc: "Bakı və regionlara operativ çatdırılma" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-card-border p-8 rounded-lg relative overflow-hidden group hover:border-secondary/50 transition-colors"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
              <feature.icon className="w-12 h-12 text-secondary mb-6" />
              <h3 className="font-display text-2xl text-white uppercase mb-3 tracking-wide">{feature.title}</h3>
              <p className="text-muted-foreground font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ELAQE */}
      <section id="elaqe" className="py-24 bg-card/50 border-t border-card-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-5xl font-display text-white uppercase mb-4"
            >
              Bizimlə Əlaqə
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6"
            >
              Korporativ sifarişlər, toplu alışlar və ətraflı məlumat üçün aşağıdakı kanallardan bizimlə əlaqə saxlayın
            </motion.p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              {
                icon: Phone, color: "#00c8ff", bg: "bg-primary/10", border: "border-primary/50",
                hoverBorder: "hover:border-primary/50", title: "Zəng edin", sub: "Həftə içi 09:00–18:00",
                value: "+994 51 729 03 86", action: "İndi Zəng et", href: "tel:+994517290386",
                btnBg: "bg-primary/10 hover:bg-primary", btnText: "text-primary hover:text-primary-foreground"
              },
              {
                icon: MessageCircle, color: "#25D366", bg: "bg-[#25D366]/10", border: "border-[#25D366]/50",
                hoverBorder: "hover:border-[#25D366]/50", title: "WhatsApp", sub: "İstənilən vaxt mesaj göndərin",
                value: "+994 50 379 18 06", action: "WhatsApp Yaz", href: WhatsAppLink,
                btnBg: "bg-[#25D366]/10 hover:bg-[#25D366]", btnText: "text-[#25D366] hover:text-white",
                isWhatsApp: true
              },
              {
                icon: Mail, color: "#ff6b00", bg: "bg-[#ff6b00]/10", border: "border-[#ff6b00]/50",
                hoverBorder: "hover:border-[#ff6b00]/50", title: "E-poçt", sub: "Sifariş və sorğularınız üçün",
                value: "TuranBaba@turkaz.online", action: "Məktub Göndər", href: "mailto:TuranBaba@turkaz.online",
                btnBg: "bg-[#ff6b00]/10 hover:bg-[#ff6b00]", btnText: "text-[#ff6b00] hover:text-white"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`bg-card border border-card-border p-8 rounded-lg flex flex-col items-center text-center ${card.hoverBorder} transition-colors group`}
              >
                <div className={`w-16 h-16 rounded-full ${card.bg} flex items-center justify-center mb-6`}>
                  <card.icon className="w-8 h-8" style={{ color: card.color }} />
                </div>
                <h3 className="font-display text-2xl text-white uppercase mb-1">{card.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{card.sub}</p>
                <div className="font-display text-2xl md:text-3xl mb-6 tracking-wider" style={{ color: card.color }}>
                  {card.value}
                </div>
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`w-full ${card.btnBg} ${card.btnText} border ${card.border} py-3 rounded font-display tracking-widest text-lg transition-all duration-200 uppercase flex items-center justify-center gap-2 mt-auto`}
                >
                  {card.isWhatsApp && <FaWhatsapp className="w-5 h-5" />}
                  {card.action}
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto relative p-[1px] rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-lg" />
            <div className="relative bg-[#0a1628]/95 backdrop-blur-md rounded-lg p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-16 h-16 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wider mb-4">Korporativ müştərilər üçün</h3>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                  <span className="bg-white/10 text-white text-sm px-4 py-2 rounded-full font-medium">Toplu sifariş endirimi</span>
                  <span className="bg-white/10 text-white text-sm px-4 py-2 rounded-full font-medium">Faktura və müqavilə tərtibatı</span>
                  <span className="bg-white/10 text-white text-sm px-4 py-2 rounded-full font-medium">Çatdırılma xidməti</span>
                  <span className="bg-white/10 text-white text-sm px-4 py-2 rounded-full font-medium">Fərdi qiymət təklifi</span>
                </div>
                <div className="text-muted-foreground text-sm border-t border-white/10 pt-4 mt-2 flex flex-col md:flex-row gap-2 justify-center md:justify-start">
                  Əlaqə üçün:
                  <a href="tel:+994503791806" className="text-white hover:text-primary transition-colors">+994 50 379 18 06</a>
                  <span className="hidden md:inline">•</span>
                  <a href="mailto:TuranBaba@turkaz.online" className="text-white hover:text-primary transition-colors">TuranBaba@turkaz.online</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background border-t border-border py-12 px-4 text-center">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl tracking-widest mb-6"
          >
            <img src="https://i.ibb.co/Z6W4mMTB/logo-dizayn-aku.png" alt="Turkaz Enerji" className="h-10 w-auto object-contain mx-auto" />
          </motion.div>

          <div className="flex justify-center gap-6 mb-8">
            {[
              { icon: Phone, href: "tel:+994517290386", hover: "hover:text-primary hover:border-primary" },
              { icon: FaWhatsapp, href: WhatsAppLink, hover: "hover:text-[#25D366] hover:border-[#25D366]", external: true },
              { icon: Mail, href: "mailto:TuranBaba@turkaz.online", hover: "hover:text-orange-500 hover:border-orange-500" }
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={`w-10 h-10 rounded-full bg-card border border-card-border flex items-center justify-center text-muted-foreground ${item.hover} transition-colors`}
              >
                <item.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-8">
            {["Yigit Aku", "•", "Bülbül Battery", "•", "Perge Aku", "•", "Klas Aku", "•", "Yuras"].map((item, i) => (
              <span key={i} className={i % 2 === 0 ? "hover:text-primary/50 transition-colors" : ""}>{item}</span>
            ))}
          </div>

          <p className="text-muted-foreground/60 text-sm mb-2">
            &copy; 2026 Turkaz Enerji MMC. Bütün hüquqlar qorunur.
          </p>
          <p className="text-muted-foreground/40 text-xs">
            Göstərilən qiymətlər korporativ, ƏDV xaric endirimli qiymətlərdir.
          </p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 2 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      >
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
          className="hidden md:block bg-card text-white font-semibold text-sm px-3 py-1.5 rounded-sm shadow-lg border border-card-border"
        >
          Sifariş et
        </motion.span>
        <a
          href={WhatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] animate-wapulse"
        >
          <FaWhatsapp className="w-8 h-8 relative z-10" />
        </a>
      </motion.div>

      <BackToTop />
    </div>
  );
}
