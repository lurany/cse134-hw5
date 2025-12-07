class ProjectCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute("title") || "";
        const image = this.getAttribute("image") || "";
        const alt = this.getAttribute("alt") || "";
        const caption = this.getAttribute("caption") || "";
        const description = this.getAttribute("description") || "";
        const highlightsAttr = this.getAttribute("highlights") || "";
        
        const pieces = highlightsAttr
        .split("|")
        .map(part => part.trim())
        .filter(part => part.length > 0);

        let highlightsHTML = "";
        if (pieces.length > 0) {
            highlightsHTML= "<ul>";
            for (const item of pieces) {
                highlightsHTML += `<li>${item}</li>`;
            }
            highlightsHTML += "</ul>";
        }

        let figureHTML = "";
        if (image) {
            figureHTML = `<figure><img src="${image}" alt="${alt}">${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
        }

        this.innerHTML = `<article class="project-card"><h3>${title}</h3>${figureHTML}${description ? `<p>${description}</p>` : ""}${highlightsHTML}</article>`;

    }
}
customElements.define("project-card", ProjectCard);