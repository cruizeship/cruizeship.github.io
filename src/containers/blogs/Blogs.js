import React from "react";
import "./Blog.scss";
import {blogSection} from "../../portfolio";
import blogsData from "../../data/blogs.json";

const ARTICLE_COUNT = 3;

function BlogCard({blog, isPlaceholder}) {
  return (
    <div
      className={
        isPlaceholder
          ? "lumina-blog-card lumina-blog-card--placeholder scroll-reveal"
          : "lumina-blog-card scroll-reveal"
      }
      aria-hidden={isPlaceholder ? "true" : undefined}
    >
      <div className="lumina-blog-thumbnail">
        {blog.image ? (
          <img src={blog.image} alt={blog.title} />
        ) : (
          <div className="lumina-blog-placeholder">
            <span className="material-symbols-outlined">article</span>
          </div>
        )}
      </div>
      <div className="lumina-blog-content">
        <h3 className="lumina-blog-title">{blog.title}</h3>
        <p className="lumina-blog-desc">{blog.description}</p>
        {!isPlaceholder && (
          <a
            href={blog.url}
            className="lumina-blog-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            READ_ON_MEDIUM
            <span className="material-symbols-outlined lumina-arrow-icon">
              arrow_forward
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

function padArticles(blogs, count) {
  const items = blogs.slice(0, count).map(blog => ({
    ...blog,
    isPlaceholder: false
  }));

  while (items.length < count) {
    const index = items.length + 1;
    items.push({
      url: `placeholder-${index}`,
      title: "Coming soon",
      description: "New article placeholder — more writing on the way.",
      image: null,
      isPlaceholder: true
    });
  }

  return items;
}

export default function Blogs() {
  if (!blogSection.display) {
    return null;
  }

  const fromData = (blogsData.items || []).map(blog => ({
    url: blog.url,
    title: blog.title,
    description: blog.description,
    image: blog.image || null
  }));

  const fallback = blogSection.blogs.map(blog => ({
    url: blog.url,
    title: blog.title,
    description: blog.description,
    image: blog.image || null
  }));

  const displayBlogs = padArticles(
    fromData.length > 0 ? fromData : fallback,
    ARTICLE_COUNT
  );

  return (
    <section className="lumina-section lumina-blogs" id="articles">
      <div className="lumina-container">
        <div className="lumina-blogs-header scroll-reveal">
          <h2 className="lumina-headline">{blogSection.title}</h2>
        </div>
        {blogSection.subtitle && (
          <p className="lumina-body-md lumina-blogs-subtitle scroll-reveal">
            {blogSection.subtitle}
          </p>
        )}
        <div className="lumina-blogs-grid-wrap">
          <div className="lumina-blogs-grid">
            {displayBlogs.map(blog => (
              <BlogCard
                key={blog.url || blog.title}
                blog={blog}
                isPlaceholder={blog.isPlaceholder}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
