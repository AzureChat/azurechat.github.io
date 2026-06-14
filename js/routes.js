// The route table. Each route either points at an HTML fragment to fetch, or
// returns markup to render directly (used for the dynamic blog post route).
//
// A path segment beginning with ":" is a parameter, e.g. "/blog/:slug" matches
// "/blog/native-page-transitions" and passes { slug: "native-page-transitions" }.

export const routes = [
  { path: "/", title: "Ship the source", fragment: "pages/home.html" },
  { path: "/about", title: "How it works", fragment: "pages/about.html" },
  { path: "/blog", title: "Build log", fragment: "pages/blog.html" },
  {
    path: "/blog/:slug",
    title: "Build log",
    // The <blog-post> element looks the post up in the JSON and refines the title.
    render: ({ slug }) =>
      `<blog-post slug="${slug.replace(/"/g, "")}"></blog-post>`,
  },
  { path: "/contact", title: "Get in touch", fragment: "pages/contact.html" },
];

export const notFound = { title: "Page not found", fragment: "pages/not-found.html" };
