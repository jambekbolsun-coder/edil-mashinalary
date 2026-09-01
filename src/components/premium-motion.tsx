"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PremiumMotion() {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ".hero-copy > *",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power2.out", delay: 0.12 },
      );

      ScrollTrigger.batch(".product-card, .blog-card", {
        start: "top 90%",
        once: true,
        onEnter: (items) => {
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out", overwrite: true },
          );
        },
      });

      document.querySelectorAll<HTMLElement>(".finance-steps article").forEach((card, index) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0.45, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.04,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });

      const valueCopy = document.querySelector<HTMLElement>(".value-copy > p");
      if (valueCopy) {
        gsap.fromTo(
          valueCopy,
          { autoAlpha: 0.35, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: valueCopy, start: "top 88%", end: "top 62%", scrub: 0.5 },
          },
        );
      }
    });

    return () => media.revert();
  });

  return null;
}
