const BIN_ID = "69352fbcd0ea881f40183810";
const ACCESS_KEY = "$2a$10$g9L.4Zq0yAw6M5gwMbJMRumjSVYaSwPJAmvSJ2WXlGeMYxBji2atO";

const LOCAL_KEY = "hw5-projects";
const REMOTE_URL = "https://api.jsonbin.io/v3/b/69352fbcd0ea881f40183810";

const localProjectsData = [
    {
        "id": 1,
        "title": "Moody day",
        "image": "images/IMG_4987.jpg",
        "alt": "Guy standing outside while the skies are foggy",
        "caption": "when the skies are sad, who is there to comfort them?",
        "description": "I made this project to make a story about cicumstances in life, where it is okay to be selfish somtimes because selfcare.",
        "highlights": [
            "Captured perfect moment of person looking away"  
        ]
    },
    {
        "id": 2,
        "title": "Golden hour",
        "image": "images/sullyoon.jpg",
        "alt": "Girl looking up with her eyes closed to feel the sun's warmth",
        "caption": "She's got glow on her face, the angel of light",
        "description": "I chose this picture to depict the beauty of my favorite singer.",
        "highlights": [
        "pink and orange skies"
        ]
    }
];

function renderProjects(projects) {
    const grid = document.getElementById("projects-grid");

    if (!grid) {
        console.error("not found");
        return;
    }

    grid.innerHTML = "";

    projects.forEach(project => {
        const card = document.createElement("project-card");

        card.setAttribute("title", project.title || "");
        card.setAttribute("image", project.image || "");
        card.setAttribute("alt", project.alt || "");
        card.setAttribute("caption", project.caption || "");
        card.setAttribute("description", project.description || "");
        card.setAttribute("highlights", (project.highlights || []).join("|"));

        grid.appendChild(card);
    });
}

    function loadLocal() {
        let saved = localStorage.getItem(LOCAL_KEY);

        if (!saved) {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(localProjectsData));
            saved = localStorage.getItem(LOCAL_KEY);
        }

        const projects = JSON.parse(saved);
        renderProjects(projects);
    }

    function loadRemote() {
        fetch(REMOTE_URL, {
            headers: {
                "X-Access-Key": ACCESS_KEY
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("status " + res.status);
            }
            return res.json();
        })
        .then(data => {
            let projects = data;

            if (projects.record) {
                projects = projects.record;
            }
            if (projects.record) {
                projects = projects.record;
            }

            if (!Array.isArray(projects)) {
                throw new Error("Unexpected JSON shape");
            }

            renderProjects(projects);
        })
        .catch(err => {
            console.error("Fetch failed:", err);
            alert("Remote load failed")
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const localBtn = document.getElementById("load-local");
        const remoteBTn = document.getElementById("load-remote");

        if (localBtn) localBtn.addEventListener("click", loadLocal);
        if (remoteBTn) remoteBTn.addEventListener("click", loadRemote);
    });