"use client";

import { motion } from "framer-motion";

export function AnnouncementBar() {
  const announcements = [
    "FREE SHIPPING ON ALL MYSTERY BUNDLES",
    "•",
    "NEW VINTAGE TEES DROPPED",
    "•",
    "CUSTOM DESIGNS NOW OPEN",
    "•",
    "USE CODE THRIFT10 FOR 10% OFF YOUR FIRST ORDER",
    "•"
  ];

  // Repeat to ensure smooth infinite scroll
  const items = [...announcements, ...announcements, ...announcements, ...announcements];

  return (
    <div className="w-full bg-primary text-primary-foreground py-2 overflow-hidden flex items-center">
      <motion.div
        className="flex whitespace-nowrap gap-8 text-xs font-medium uppercase tracking-widest"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {items.map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
}
