import { useRef, type ReactNode } from "react";
import { Footer, Header, PageNavigation, type PublicPageName } from "./components";
import { useLandingMotion } from "./landing-motion";
import "./landing.css";
import "./landing-transitions.css";
import "./landing-motion.css";
import "./site-pages.css";
import "./motion/motion-variety.css";

export function PublicLayout({
  page,
  lightHeader = false,
  children,
}: {
  page?: PublicPageName;
  lightHeader?: boolean;
  children: ReactNode;
}) {
  const landing = useRef<HTMLDivElement>(null);
  useLandingMotion(landing);

  return (
    <div className="sv-landing" ref={landing} data-header-light={lightHeader || undefined} data-home-opening={page === "home" || undefined}>
      <Header current={page} />
      <main id="conteudo" tabIndex={-1}>{children}</main>
      <Footer home={page === "home"} />
      <PageNavigation focusTitle={page !== "home"} />
    </div>
  );
}
