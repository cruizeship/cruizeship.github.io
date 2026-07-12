import React, {useEffect} from "react";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import ExperienceEducation from "./experienceEducation/ExperienceEducation";
import StartupProject from "./StartupProjects/StartupProject";
import Blogs from "./blogs/Blogs";
import MiscSection from "./misc/MiscSection";
import Footer from "../components/footer/Footer";
import {useGlobalScrollReveal} from "../hooks/useGlobalScrollReveal";
import {useSmoothScroll} from "../hooks/useSmoothScroll";
import {initFlashDebug} from "../utils/flashDebug";
import "./Main.scss";

const Main = () => {
  useGlobalScrollReveal();
  useSmoothScroll();

  useEffect(() => initFlashDebug(), []);

  return (
    <div className="lumina-page">
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
