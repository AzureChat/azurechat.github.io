// <blog-list></blog-list>            full list
// <blog-list limit="3"></blog-list>  newest 3 (used on the home page)
// <blog-list show-filter></blog-list> with tag filter buttons
//
// The entire blog is one file. Import attributes load it straight into the
// module — no fetch(), no JSON.parse(). The browser fetches posts.json once and
// shares it with <blog-post>.

import posts from "../data/posts.json" with { type: "json" };
import { escapeHTML, formatDate, slugSafe } from "../js/dom.js";

const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

function allTags() {
  const set = new Set();
  for (const post of sorted) for (const tag of post.tags || []) set.add(tag);
  return [...set].sort();
}

class BlogList extends HTMLElement {
  connectedCallback() {
    this.limit = Number(this.getAttribute("limit")) || 0;
    this.showFilter = this.hasAttribute("show-filter");
    this.activeTag = null;
    this.#render();
  }

  get #visible() {
    let list = sorted;
    if (this.activeTag) {
      list = list.filter((p) => (p.tags || []).includes(this.activeTag));
    }
    return this.limit > 0 ? list.slice(0, this.limit) : list;
  }

  #cardHTML(post) {
    const slug = slugSafe(post.slug);
    const meta = [
      `<time datetime="${escapeHTML(post.date)}">${formatDate(post.date)}</time>`,
      post.readingMinutes
        ? `<span aria-hidden="true">·</span><span>${escapeHTML(post.readingMinutes)} min read</span>`
        : "",
    ].join("");

    const tags = (post.tags || [])
      .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
      .join("");

    return `
      <article class="post-card">
        <a class="post-card__link" href="#/blog/${slug}">
          <p class="post-card__meta">${meta}</p>
          <h3 class="post-card__title" style="view-transition-name: post-${slug}">${escapeHTML(post.title)}</h3>
          <p class="post-card__excerpt">${escapeHTML(post.excerpt || "")}</p>
        </a>
        ${tags ? `<p class="post-card__tags">${tags}</p>` : ""}
      </article>`;
  }

  #filterHTML() {
    if (!this.showFilter) return "";
    const chip = (tag, label, active) =>
      `<button type="button" class="chip${active ? " is-active" : ""}" data-tag="${escapeHTML(tag)}">${escapeHTML(label)}</button>`;

    return `
      <div class="blog-filter" role="group" aria-label="Filter posts by tag">
        ${chip("", "All", !this.activeTag)}
        ${allTags().map((t) => chip(t, t, this.activeTag === t)).join("")}
      </div>`;
  }

  #render() {
    const cards = this.#visible.map((p) => this.#cardHTML(p)).join("");
    const empty = this.#visible.length
      ? ""
      : `<p class="muted">No posts tagged "${escapeHTML(this.activeTag || "")}" yet.</p>`;

    this.innerHTML = `${this.#filterHTML()}<div class="post-grid">${cards}</div>${empty}`;

    if (this.showFilter) {
      this.querySelectorAll(".chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.activeTag = btn.dataset.tag || null;
          this.#render();
        });
      });
    }
  }
}

customElements.define("blog-list", BlogList);
