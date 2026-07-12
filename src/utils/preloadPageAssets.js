import headshot from "../assets/images/headshot.png";
import app1 from "../assets/images/app.png";
import app2 from "../assets/images/app2.png";
import app3 from "../assets/images/app3.png";
import {
  miscSection,
  workExperiences,
  educationInfo
} from "../portfolio";
import blogsData from "../data/blogs.json";

function preloadImage(src) {
  if (!src) {
    return Promise.resolve();
  }
  return new Promise(resolve => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

/** Collect static local + remote images used on this page. */
export function collectPageImageUrls() {
  const urls = [headshot, app1, app2, app3];

  (miscSection.polaroids || []).forEach(polaroid => {
    if (polaroid.image) {
      urls.push(polaroid.image);
    }
  });

  (blogsData.items || []).forEach(blog => {
    if (blog.image) {
      urls.push(blog.image);
    }
  });

  (workExperiences.experience || []).forEach(exp => {
    if (exp.companylogo) {
      urls.push(exp.companylogo);
    }
  });

  (educationInfo.schools || []).forEach(school => {
    if (school.logo) {
      urls.push(school.logo);
    }
  });

  return [...new Set(urls)];
}

/**
 * Wait until fonts + page images are decoded so reload layout does not shift
 * and scroll-reveal fades in against ready content.
 */
export function preloadPageAssets() {
  const fontsReady =
    document.fonts && document.fonts.ready
      ? document.fonts.ready.catch(() => {})
      : Promise.resolve();

  const imagesReady = Promise.all(
    collectPageImageUrls().map(src => preloadImage(src))
  );

  return Promise.all([fontsReady, imagesReady]);
}
