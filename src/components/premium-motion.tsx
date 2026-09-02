"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PremiumMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      anchors: true,
    });
    let animationFrame = 0;
    const update = (time: number) => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(update);
    };
    lenis.on("scroll", ScrollTrigger.update);
    animationFrame = window.requestAnimationFrame(update);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const heroItems = gsap.utils.toArray<HTMLElement>(".hero-copy > *");
      if (heroItems.length) {
        gsap.fromTo(
          heroItems,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power2.out", delay: 0.12 },
        );
      }

      const revealCards = gsap.utils.toArray<HTMLElement>(".product-card, .blog-card");
      if (revealCards.length) {
        ScrollTrigger.batch(revealCards, {
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
      }

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

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      media.revert();
    };
  }, { dependencies: [pathname], revertOnUpdate: true });

  return null;
}
