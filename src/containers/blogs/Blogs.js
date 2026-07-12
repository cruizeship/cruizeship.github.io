import React, {useState, useEffect} from "react";
import "./Blog.scss";
import {blogSection} from "../../portfolio";

function extractTextContent(html) {
  return typeof html === "string"
    ? html
        .split(/<\/p>/i)
        .map(part => part.split(/<p[^>]*>/i).pop())
        .filter(el => el.trim().length > 0)
        .map(el => el.replace(/<\/?[^>]+(>|$)/g, "").trim())
        .join(" ")
    : "";
}

function extractCoverImage(blog) {
  if (blog.thumbnail) return blog.thumbnail;
  if (blog.enclosure && blog.enclosure.link) return blog.enclosure.link;

  const html = blog.content || blog.description || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function BlogCard({blog}) {
  return (
    <div className="lumina-blog-card">
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
      </div>
    </div>
  );
}

export default function Blogs() {
  const [mediumBlogs, setMediumBlogs] = useState([]);

  useEffect(() => {
    if (blogSection.displayMediumBlogs === "true") {
      fetch("/blogs.json")
        .then(result => (result.ok ? result.json() : Promise.reject()))
        .then(response => setMediumBlogs(response.items || []))
        .catch(() => setMediumBlogs([]));
    }
  }, []);

  const blogs =
    blogSection.displayMediumBlogs === "true" && mediumBlogs.length > 0
      ? mediumBlogs.map(blog => ({
          url: blog.link,
          title: blog.title,
          description: extractTextContent(blog.content),
          image: extractCoverImage(blog)
        }))
      : blogSection.blogs.map(blog => ({
          url: blog.url,
          title: blog.title,
          description: blog.description,
          image: blog.image || null
        }));

  const displayBlogs = blogSection.display ? blogs.slice(0, 4) : [];

  if (!blogSection.display) {
    return null;
  }

  return (
    <section className="lumina-section lumina-blogs" id="articles">
      <div className="lumina-container">
        <div className="lumina-blogs-header">
          <h2 className="lumina-headline">{blogSection.title}</h2>
        </div>
        {blogSection.subtitle && (
          <p className="lumina-body-md lumina-blogs-subtitle">
            {blogSection.subtitle}
          </p>
        )}
        <div className="lumina-blogs-grid">
          {displayBlogs.map(blog => (
            <BlogCard key={blog.url || blog.title} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
