const BIN_ID = "69352fbcd0ea881f40183810";
const MASTER_KEY = "$2a$10$t8UlXWRE4pDse0R5VkMjV.bdrdtDppcIRRdXkShYNOawKws7Ul9va";
const REMOTE_URL = "https://api.jsonbin.io/v3/b/69352fbcd0ea881f40183810";

function readForm() {
  const idValue = document.getElementById("project-id").value;
  const highlightsRaw = document.getElementById("project-highlights").value || "";

  const highlights = highlightsRaw
    .split("|")
    .map(part => part.trim())
    .filter(part => part.length > 0);

  return {
    id: idValue ? Number(idValue) : null,
    title: document.getElementById("project-title").value || "",
    image: document.getElementById("project-image").value || "",
    alt: document.getElementById("project-alt").value || "",
    caption: document.getElementById("project-caption").value || "",
    description: document.getElementById("project-description").value || "",
    highlights: highlights
  };
}

function setStatus(message) {
  const p = document.getElementById("status");
  if (p) {
    p.textContent = message;
  }
}

async function getRemoteProjects() {
  const res = await fetch(REMOTE_URL, {
    headers: {
      "X-Master-Key": MASTER_KEY
    }
  });

  if (!res.ok) {
    throw new Error("GET failed with status " + res.status);
  }

  const data = await res.json();

  let projects = data;

  if (projects.record) {
    projects = projects.record;
  }

  if (projects.record) {
    projects = projects.record;
  }

  if (!Array.isArray(projects)) {
    throw new Error("Unexpected JSON format");
  }

  return projects;
}

async function saveRemoteProjects(projects) {
  const res = await fetch(REMOTE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": MASTER_KEY
    },
    body: JSON.stringify({ record: projects })
  });

  if (!res.ok) {
    throw new Error("PUT failed with status " + res.status);
  }

  const data = await res.json();
  return data.record || projects;
}

async function handleCreate() {
  try {
    const projects = await getRemoteProjects();
    const formData = readForm();

    if (!formData.id) {
      const maxId = projects.reduce((max, p) => Math.max(max, p.id || 0), 0);
      formData.id = maxId + 1;
    }

    projects.push(formData);
    await saveRemoteProjects(projects);
    setStatus("Created project with id " + formData.id + " in JSONBin.");
  } catch (err) {
    console.error(err);
    setStatus("Create failed: " + err.message);
  }
}

async function handleUpdate() {
  try {
    const formData = readForm();
    if (!formData.id) {
      setStatus("Please enter an id to update.");
      return;
    }

    const projects = await getRemoteProjects();
    const index = projects.findIndex(p => Number(p.id) === formData.id);

    if (index === -1) {
      setStatus("No project found with id " + formData.id);
      return;
    }

    projects[index] = formData;
    await saveRemoteProjects(projects);
    setStatus("Updated project with id " + formData.id + ".");
  } catch (err) {
    console.error(err);
    setStatus("Update failed: " + err.message);
  }
}

async function handleDelete() {
  try {
    const idValue = document.getElementById("project-id").value;
    const id = idValue ? Number(idValue) : null;

    if (!id) {
      setStatus("Please enter an id to delete.");
      return;
    }

    const projects = await getRemoteProjects();
    const remaining = projects.filter(p => Number(p.id) !== id);

    if (remaining.length === projects.length) {
      setStatus("No project found with id " + id);
      return;
    }

    await saveRemoteProjects(remaining);
    setStatus("Deleted project with id " + id + ".");
  } catch (err) {
    console.error(err);
    setStatus("Delete failed: " + err.message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btn-create").addEventListener("click", handleCreate);
  document.getElementById("btn-update").addEventListener("click", handleUpdate);
  document.getElementById("btn-delete").addEventListener("click", handleDelete);
});