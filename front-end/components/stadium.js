class SpawnStadium extends HTMLElement {
    connectedCallback() {
      // Read the count attribute; default to 1 if not provided
      const count = parseInt(this.getAttribute('count')) || 1;
      let html = "";
      // Build the SVG markup count times, with unique IDs
      for (let i = 1; i <= count; i++) {
        html += `
          <div id="stadium-${i}" class="stadium-shape">
            <svg viewBox="0 0 10 4">
              <rect x="0" y="0" width="10" height="4" rx="2" ry="2"></rect>
            </svg>
          </div>`;
      }
      // Insert the generated HTML into this custom element
      this.innerHTML = html;
    }
  }
  // Register the custom element
  customElements.define('spawn-stadium', SpawnStadium);  