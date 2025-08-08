import { motion, useReducedMotion } from "framer-motion";
import { Twitter, ExternalLink, Quote } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

/* ─── 0. Demo data (delete when wiring to backend) ────────────────────────── */
const DEFAULT_ITEMS = [
  {
    id: "1",
    quote:
      "This timer looks like it would be very useful for game nights. Might also be a good way to help kids understand time better.",
    author: "Ben",
    handle: "@BenBoarer",
    avatarUrl:
      "https://pbs.twimg.com/profile_images/1936938332283449344/Ikq2iXOp_400x400.jpg",
    sourceUrl: "https://twitter.com/BenBoarer/status/1952303986461286755",
    sourceType: "twitter",
  },
  {
    id: "2",
    quote:
      "Looks like you were able to stay focused on creating a solution to one specific problem and not get distracted by the many other options there can be. An app for this with some TikTok video ads could lead to many downloads imo.",
    author: "Matteo",
    handle: "@senseofwondr",
    avatarUrl:
      "https://pbs.twimg.com/profile_images/1940080191230885888/H77jwv_H_400x400.jpg",
    sourceUrl: "https://x.com/senseofwondr/status/1951296875937566956",
    sourceType: "twitter",
  },
  {
    id: "3",
    quote:
      "Your sharemytimer.live project sounds cool — keep pushing it forward, you got this!",
    author: "Tommy Phan",
    handle: "@0xyyy77",
    avatarUrl:
      "https://pbs.twimg.com/profile_images/1911371268718272512/bKqXMOCv_400x400.jpg",
    sourceUrl: "https://x.com/0xyyy77/status/1950129137936437377",
    sourceType: "twitter",
  },
  {
    id: "4",
    quote:
      "As a software engineer, I often work with teams across different locations. ShareMyTimer is one of those rare tools that just works — simple, reliable, and super handy.",
    author: "Sachin Pathak",
    handle: "@SachinPathak291",
    avatarUrl:
      "https://pbs.twimg.com/profile_images/1872963615889752064/WDNfFRGF_400x400.jpg",
    sourceUrl: "https://x.com/SachinPathak291/status/1953779783403250142",
    sourceType: "twitter",
  },
];

/* ─── 1. Tiny helpers ─────────────────────────────────────────────────────── */
const SourceBadge = ({ type }) => {
  const Icon = type === "twitter" ? Twitter : ExternalLink;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-[10px] sm:text-xs font-medium border border-blue-100 group-hover:scale-105 transition-transform">
      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
      {type === "twitter" ? "View on X" : "Source"}
    </span>
  );
};

const Avatar = ({ src, alt, fallback }) => {
  const [err, setErr] = useState(false);
  return (
    <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full bg-gray-100 text-gray-400 ring-1 ring-gray-200 items-center justify-center">
      {src && !err ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setErr(true)}
        />
      ) : (
        <span className="text-xs sm:text-sm font-semibold">{fallback}</span>
      )}
    </div>
  );
};

/* ─── 2. Single testimonial card ─────────────────────────────────────────── */
const Card = ({ item }) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const reduceMotion = useReducedMotion();

  const clickable = Boolean(item.sourceUrl);
  const type = useMemo(() => {
    if (!item.sourceUrl) return null;

    return (
      item.sourceType ??
      (item.sourceUrl.includes("x.com") ||
      item.sourceUrl.includes("twitter.com")
        ? "twitter"
        : "link")
    );
  }, [item.sourceUrl, item.sourceType]);

  /* Disable pointer-move glow on touch devices */
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) {
      setPos({ x: 50, y: 50 });
    }
  }, []);

  const inner = (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white text-gray-900 shadow-sm hover:shadow-md sm:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500/60 group transition-shadow duration-300 w-[320px] sm:w-[360px] flex-shrink-0"
      style={{
        opacity: 1, // Fallback opacity
        backgroundImage: `radial-gradient(90px 90px at ${pos.x}% ${pos.y}%, rgba(59,130,246,0.07), transparent 70%)`,
      }}
      onMouseMove={(e) => {
        if (window.matchMedia("(hover: none)").matches) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const scrollContainer = e.currentTarget.closest(
          '[class*="overflow-x-scroll"]'
        );

        // Prevent mouse tracking at scroll boundaries
        if (scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const relativeX = e.clientX - containerRect.left;
          const isAtLeftEdge =
            scrollContainer.scrollLeft === 0 && relativeX < 50;
          const isAtRightEdge =
            scrollContainer.scrollLeft >=
              scrollContainer.scrollWidth - scrollContainer.clientWidth &&
            relativeX > containerRect.width - 50;

          if (isAtLeftEdge || isAtRightEdge) return;
        }

        setPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4 sm:gap-6">
          <Avatar
            src={item.avatarUrl}
            alt={`${item.author} avatar`}
            fallback={item.author.slice(0, 2).toUpperCase()}
          />

          <div className="flex-1">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-bold leading-tight text-sm sm:text-base">
                  {item.author}
                </p>
                {item.handle && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    {item.handle}
                  </p>
                )}
              </div>
              {type && <SourceBadge type={type} />}
            </div>

            <blockquote className="mt-3 sm:mt-4 text-[15px] sm:text-base leading-relaxed text-gray-700">
              <Quote className="mr-1.5 sm:mr-2 inline-block h-4 w-4 text-blue-600 align-text-top" />
              {item.quote}
            </blockquote>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return clickable ? (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={`Open testimonial from ${item.author}`}
      className="block focus:outline-none"
    >
      {inner}
    </a>
  ) : (
    inner
  );
};

/* ─── 3. Section wrapper ─────────────────────────────────────────────────── */
export default function Testimonials({
  title = "What people are saying",
  subtitle = "Real feedback from creators",
  items = DEFAULT_ITEMS,
}) {
  /* Choose the layout container based on `singleRow` */
  const Container = ({ children }) => (
    <div className="flex gap-6 overflow-x-scroll py-4 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain">
      <div className="flex gap-6 pl-4 pr-4">{children}</div>
    </div>
  );

  return (
    <section
      id="testimonials"
      className="px-4 sm:px-6 py-20 sm:py-24 bg-gray-50/50 overflow-hidden"
    >
      <div className="mx-auto max-w-3xl sm:max-w-6xl">
        {/* Heading */}
        <header className="mb-12 sm:mb-20 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 font-light">
            {subtitle}
          </p>
        </header>

        <Container>
          {items.map((t) => (
            <Card key={t.id} item={t} />
          ))}
        </Container>
      </div>
    </section>
  );
}
