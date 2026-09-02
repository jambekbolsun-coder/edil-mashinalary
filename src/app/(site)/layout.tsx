import { Suspense } from "react";
import { ChatAssistant } from "@/components/chat-assistant";
import { Quiz } from "@/components/quiz";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PremiumMotion } from "@/components/premium-motion";
import { SiteTranslator } from "@/components/providers/site-translator";
import { getChatAnswers } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const answers = await getChatAnswers();
  return (
    <>
      <Suspense fallback={<div className="header-fallback" aria-hidden="true" />}><SiteHeader /></Suspense>
      <SiteTranslator />
      <PremiumMotion />
      {children}
      <SiteFooter />
      <Quiz />
      <ChatAssistant answers={answers} />
    </>
  );
}
