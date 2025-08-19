import React, { useState, useEffect } from "react";

// Key used to store the note in local storage
const NOTES_WIDGET_KEY = 'dashboardNotes';

/**
 * NotesWidget.jsx - A React component for a simple note-taking widget.
 * It automatically saves and loads a single note from local storage.
 */
const NotesWidget = () => {
// Uses a state initializer functio to load the note once from local storage
// when the component is first mounted.
const [noteContent, setNoteContent] = useState(() => {
    try {
        const savedNote = localStorage.getItem(NOTES_WIDGET_KEY);
        // Return the saved note or an empty string if none exists
        return savedNote || '';
    } catch (error) {
        console.error("Failed to load note from local storage: ", error);
        return '';
    }
});

// useEffect to save the note to local storage whenever noteContent changes.
useEffect(() => {
    try {
        localStorage.setItem(NOTES_WIDGET_KEY, noteContent);
    } catch (error) {
        console.error("Failed to save note to local sotrage: ", error);
    }
}, [noteContent]); // The dependency array ensures this runs only when noteContent changes

// Event handler to update the note content state.
const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
};

return (
    <div className="relative w-full max-w-sm p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border-white/30 text-slate-900 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Notes Blog</h2>
        <div className="w-full h-full flex flex-col">
            <textarea
            id="noteTextArea"
            value={noteContent}
            onChange={handleNoteChange}
            placeholder="Write your notes here..."
            className="w-full h-full p-4 bg-white/40 text-slate-900 placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200 resize-none"/>
        </div>
    </div>
);
}

export default NotesWidget;