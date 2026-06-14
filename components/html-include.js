// <html-include src="partials/header.html"></html-include>
//
// Fetches an HTML fragment and drops it into itself as ordinary page content
// (light DOM), so the site's global stylesheet styles it like everything else.
// Used for the shared header and footer.
//
// Note: markup injected via innerHTML never runs its <script> tags, so anything
// interactive inside a fragment must be its own custom element (e.g. the theme
// toggle), registered up front and upgraded automatically wherever it appears.

class HtmlInclude extends HTMLElement {
  static observedAttributes = ["src"];
  #loaded = false;

  connectedCallback() {
    if (!this.#loaded) this.#load();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src" && this.#loaded && oldValue !== newValue) this.#load();
  }

  async #load() {
    const src = this.getAttribute("src");
    if (!src) return;
    try {
      // Resolve against document.baseURI so the same path works whether the
      // site is served from a domain root or a project subpath like /repo/.
      const res = await fetch(new URL(src, document.baseURI));
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      this.innerHTML = await res.text();
      this.#loaded = true;
      this.dispatchEvent(
        new CustomEvent("html-include:load", { bubbles: true, detail: { src } })
      );
    } catch (err) {
      console.error(`[html-include] could not load "${src}":`, err);
      this.innerHTML = `<!-- html-include failed: ${src} -->`;
    }
  }
}

customElements.define("html-include", HtmlInclude);
