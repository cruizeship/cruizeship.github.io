import React, {useEffect, useState} from "react";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import ExperienceEducation from "./experienceEducation/ExperienceEducation";
import StartupProject from "./StartupProjects/StartupProject";
import Blogs from "./blogs/Blogs";
import MiscSection from "./misc/MiscSection";
import Footer from "../components/footer/Footer";
import {useScrollRestoration} from "../hooks/useScrollRestoration";
import {useGlobalScrollReveal} from "../hooks/useGlobalScrollReveal";
import {useSmoothScroll} from "../hooks/useSmoothScroll";
import {useScrollReloadDebug} from "../hooks/useScrollReloadDebug";
import {initFlashDebug} from "../utils/flashDebug";
import {preloadPageAssets} from "../utils/preloadPageAssets";
import "./Main.scss";

const Main = () => {
  const [assetsReady, setAssetsReady] = useState(false);

  useScrollRestoration();
  useSmoothScroll();
  useScrollReloadDebug();
  useGlobalScrollReveal(assetsReady);

  useEffect(() => initFlashDebug(), []);

  useEffect(() => {
    let cancelled = false;
    preloadPageAssets().then(() => {
      if (!cancelled) {
        setAssetsReady(true);
        document.documentElement.classList.add("lumina-assets-ready");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className={
        assetsReady ? "lumina-page lumina-page--ready" : "lumina-page"
      }
    >
      <div className="lumina-blobs" />
      <div className="lumina-content">
        <div className="lumina-hero-screen">
          <Header />
          <Greeting />
        </div>
        <main>
          <ExperienceEducation />
          <StartupProject />
          <Blogs />
          <MiscSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Main;
