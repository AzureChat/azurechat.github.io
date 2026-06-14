// The single entry point.
//
// index.html loads exactly one <script type="module" src="js/main.js">. That's
// the one import. From here, every component registers itself on import, and
// the router takes over navigation.

import "../components/html-include.js";
import "../components/theme-toggle.js";
import "../components/blog-list.js";
import "../components/blog-post.js";

import { startRouter } from "./router.js";

startRouter();
