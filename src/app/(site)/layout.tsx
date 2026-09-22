import { Suspense } from "react";
import { ChatAssistant } from "@/components/chat-assistant";
import { Quiz } from "@/components/quiz";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PremiumMotion } from "@/components/premium-motion";
import { SiteTranslator } from "@/components/providers/site-translator";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { CookieConsent } from "@/components/cookie-consent";
import { getChatAnswers, getCompanyInfo, getPublishedEquipment } from "@/lib/queries";
import { CatalogProvider } from "@/components/providers/catalog-provider";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [answers, companyInfo, products] = await Promise.all([getChatAnswers(), getCompanyInfo(), getPublishedEquipment()]);
  return (
    <CatalogProvider products={products}>
      <Suspense fallback={<div className="header-fallback" aria-hidden="true" />}><SiteHeader /></Suspense>
      <SiteTranslator />
      <Suspense><AnalyticsTracker /></Suspense>
      <PremiumMotion />
      {children}
      <SiteFooter companyInfo={companyInfo} />
      <Quiz />
      <ChatAssistant answers={answers} companyInfo={companyInfo} />
      <CookieConsent />
    </CatalogProvider>
  );
}
