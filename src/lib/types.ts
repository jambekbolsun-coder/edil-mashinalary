export type Locale = "ky" | "ru" | "en" | "tr" | "zh";

export type EquipmentCategory =
  | "loaders"
  | "excavators"
  | "dump-trucks"
  | "mixers"
  | "attachments";

export type EquipmentStatus = "in-stock" | "on-order";

export type SpecRow = {
  label: string;
  value: string;
};

export type Equipment = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  published: boolean;
  featured: boolean;
  price: number | null;
  oldPrice: number | null;
  downPayment: number | null;
  monthlyPayment: number | null;
  installmentMonths: number;
  bucket: string | null;
  loadCapacity: string | null;
  power: number | null;
  engine: string | null;
  cylinders: number | null;
  turbo: boolean | null;
  warrantyHours: number;
  promo: string | null;
  shortDescription: string;
  description: string;
  images: string[];
  specs: SpecRow[];
  equipment: string[];
  keywords: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  publishedAt: string;
  content?: string[];
};

export type LeadPayload = {
  name: string;
  phone: string;
  preference: string;
  interest: string;
  comment: string;
  consent: boolean;
  source: string;
};
