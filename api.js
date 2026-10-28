const API_URL = "https://jsonplaceholder.typicode.com/posts";

// DOM Elements
const loadBtn = document.getElementById("load-btn");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const notesList = document.getElementById("notes-list");

// In-memory array to track notes locally so JSONPlaceholder delete/mock interactions work smoothly
let currentNotes = [];

/**
 * Reusable async request wrapper
 */
async function request(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Return both body and status code for handling richer feedback (like POST status 201)
        const data = await response.json();
        return { data, status: response.status };
    } catch (error) {
        throw error;
    }
}

/**
 * Render notes list or empty state
 */
function renderNotes() {
    notesList.textContent = ""; // Clear list safely using textContent clearing

    if (currentNotes.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.className = "empty-state";
        emptyLi.textContent = "No notes available. Click 'Load notes' or create one above.";
        notesList.appendChild(emptyLi);
        return;
    }

    currentNotes.forEach((note) => {
        const li = document.createElement("li");
        li.className = "note-item";
        li.dataset.id = note.id;

        const h3 = document.createElement("h3");
        h3.textContent = note.title;

        const p = document.createElement("p");
        p.textContent = note.body;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        
        // Task 3: Delete event handler
        deleteBtn.addEventListener("click", () => deleteNote(note.id, li));

        li.appendChild(h3);
        li.appendChild(p);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

/**
 * Task 1: GET Notes
 */
async function loadNotes() {
    statusEl.textContent = "Loading notes...";
    statusEl.className = "status-loading";
    loadBtn.disabled = true;

    try {
        const { data } = await request(`${API_URL}?_limit=10`);
        currentNotes = data;
        renderNotes();
        statusEl.textContent = "Loaded 10 notes from the server.";
        statusEl.className = "status-success";
    } catch (error) {
        statusEl.textContent = "Failed to load notes. Please check your network and try again.";
        statusEl.className = "status-error";
    } finally {
        loadBtn.disabled = false;
    }
}

/**
 * Task 2: POST Note
 */
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validation
    if (!title || title.length > 100) {
        statusEl.textContent = "Validation error: Title is required and cannot exceed 100 characters.";
        statusEl.className = "status-error";
        return;
    }

    statusEl.textContent = "Creating note...";
    statusEl.className = "status-loading";
    submitBtn.disabled = true;

    try {
        const { data, status } = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ title, body, userId: 1 })
        });

        // JSONPlaceholder typically returns id 101 for new posts
        currentNotes.unshift(data);
        renderNotes();

        statusEl.textContent = `Note created (status ${status}, id ${data.id}).`;
        statusEl.className = "status-success";
        noteForm.reset();
    } catch (error) {
        statusEl.textContent = "Failed to create note. Please try again.";
        statusEl.className = "status-error";
    } finally {
        submitBtn.disabled = false;
    }
}

/**
 * Task 3: DELETE Note
 * Approach Note: JSONPlaceholder accepts DELETE requests and returns status 200, but doesn't 
 * actually modify persistent server state. To ensure the client UX works smoothly, we remove 
 * the item from our local `currentNotes` array immediately upon a successful response.
 */
async function deleteNote(id, listItemEl) {
    statusEl.textContent = `Deleting note ${id}...`;
    statusEl.className = "status-loading";

    try {
        await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        // Filter out from local state array
        currentNotes = currentNotes.filter(note => note.id !== id);
        renderNotes();

        statusEl.textContent = `Note ${id} deleted successfully.`;
        statusEl.className = "status-success";
    } catch (error) {
        statusEl.textContent = `Failed to delete note ${id}.`;
        statusEl.className = "status-error";
    }
}

// Event Listeners
loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);

// Initial empty state render on load
renderNotes();