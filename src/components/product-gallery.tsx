"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const previous = () => setActive((value) => (value - 1 + images.length) % images.length);
  const next = () => setActive((value) => (value + 1) % images.length);

  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <Image src={images[active]} alt={`${name}, фото ${active + 1}`} fill loading="eager" quality={90} fetchPriority="high" sizes="(max-width: 900px) 100vw, 58vw" />
        {images.length > 1 && (
          <div className="gallery-arrows">
            <button onClick={previous} aria-label="Предыдущее фото"><ChevronLeft aria-hidden="true" /></button>
            <button onClick={next} aria-label="Следующее фото"><ChevronRight aria-hidden="true" /></button>
          </div>
        )}
        <span className="gallery-count">{active + 1} / {images.length}</span>
      </div>
      <div className="gallery-thumbnails">
        {images.map((image, index) => (
          <button key={image} className={active === index ? "active" : undefined} onClick={() => setActive(index)} aria-label={`Показать фото ${index + 1}`}>
            <Image src={image} alt="" fill quality={84} sizes="112px" />
          </button>
        ))}
      </div>
    </div>
  );
}
