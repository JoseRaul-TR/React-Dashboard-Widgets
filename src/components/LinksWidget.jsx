import React, { useState, useEffect } from "react";
import { Plus, X, Edit, Trash2 } from "lucide-react";

// Default links to use if local storage is empty.
const defaultLinks = [
  { title: "Google", url: "https://google.com" },
  { title: "YouTube", url: "https://www.youtube.com/" },
  { title: "GitHub", url: "https://github.com" },
  { title: "ChatGPT", url: "https://chat.openai.com/" },
];

/**
 * LinkWidget.jsx - A React component for managing a list of quick links.
 * It allows users to add, edit, and delete links, with data persisted in
 * the browser's local storage.
 */
const LinksWidget = () => {
  // Use a state initializer function to load from local storage only once.
  const [links, setLinks] = useState(() => {
    try {
      const storedLinks = localStorage.getItem("dashboardLinks");
      return storedLinks ? JSON.parse(storedLinks) : defaultLinks;
    } catch (error) {
      console.error("Error loading links from local storage: ", error);
      return defaultLinks;
    }
  });
  // State for the title input field.
  const [linkTitle, setLinkTitle] = useState("");
  // State for the URL input field.
  const [linkUrl, setLinkUrl] = useState("");
  // State to track if the add/eddit form is open.
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State to store the index of the link bein edited. -1 means no editing.
  const [editingIndex, setEditingIndex] = useState(-1);
  // State for displaying validation or error messages.
  const [errorMessage, setErrorMessage] = useState("");
  // State to control the delete confirmation modal.
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // State to hold the index of the link to be deleted.
  const [linkToDeleteIndex, setLinkToDeleteIndex] = useState(null);

  // useEffect to save links when changed *after* initial load.
  useEffect(() => {
    try {
      localStorage.setItem("dashboardLinks", JSON.stringify(links));
    } catch (error) {
      console.error("Error saving links to local storage: ", error);
      setErrorMessage("Could not save links to local storage.");
    }
  }, [links]); // This effect runs whenever 'links' is updated.

  // Validate if a string is a valid URL.
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Toggles the visibility of the form and resets state when closing.
  const handleToggleForm = () => {
    setIsFormOpen(!isFormOpen);
    setErrorMessage("");
    // Reset form and editing state when closing the form.
    if (isFormOpen) {
      setLinkTitle("");
      setLinkUrl("");
      setEditingIndex(-1);
    }
  };

  // Handles adding a new link or updating an existing one.
  const handleAddOrEditLink = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic validation.
    if (!linkTitle.trim() || !linkUrl.trim()) {
      setErrorMessage("Please provide a tittle and a URL.");
      return;
    }
    if (!isValidUrl(linkUrl)) {
      setErrorMessage("Invalid URL. Please enter a valid web address.");
      return;
    }

    const newLink = { title: linkTitle.trim(), url: linkUrl.trim() };

    if (editingIndex !== -1) {
      // Update existing link.
      const updatedLinks = [...links];
      updatedLinks[editingIndex] = newLink;
      setLinks(updatedLinks);
      setEditingIndex(-1);
    } else {
      // Add new link.
      setLinks([...links, newLink]);
    }

    // Reset form fields and close the form.
    setLinkTitle("");
    setLinkUrl("");
    handleToggleForm();
  };

  // Pre-fills the form with data for editing a link.
  const handleEditLink = (index) => {
    setEditingIndex(index);
    setLinkTitle(links[index].title);
    setLinkUrl(links[index].url);
    setIsFormOpen(true);
  };

  // Deletes a link after confirmation.
  const handleDeleteLink = (index) => {
    // Show confirmation modal
    setLinkToDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const updatedLinks = links.filter(
      (_, index) => index !== linkToDeleteIndex
    );
    setLinks(updatedLinks);
    setShowDeleteConfirm(false);
    setLinkToDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setLinkToDeleteIndex(null);
  };

  return (
    <div className="relative w-full max-w-sm p-6 bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-700">
      <h2 className="text-sl font-bold mb-4 text-center text-slate-200">
        Quick Links
      </h2>

      {/* List of links */}
      <ul className="flex flex-col space-y-3 mb-6">
        {links.map((link, index) => (
          <li
            key={index}
            className="flex items-center space-x-3 text-sm bg-slate-700/50 p-3 rounded-xl shadow-inner transition-colors duration-200 hover:bg-slate-700"
          >
            {/* Favicon from Google's service */}
            <img
              src={`https://www.google.com/s2/favicons?sz=32&domain=${
                new URL(link.url).hostname
              }`}
              alt={`${link.title} favicon`}
              className="w-5 h-5"
            />
            {/* Link title */}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow text-slate-200 truncate hover:underline, cursor-pointer"
            >
              {link.title}
            </a>
            {/* Edit button */}
            <button
              onClick={() => handleEditLink(index)}
              className="p-1 text-sky-400 hover:text-sky-300 transition-colors duration-200"
            >
              <Edit size={16} />
            </button>
            {/* Delete button */}
            <button
              onClick={() => handleDeleteLink(index)}
              className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      {/* The add/edit form, conditionally rendered */}
      {isFormOpen && (
        <form onSubmit={handleAddOrEditLink} className="space-y-4">
          <input
            type="text"
            placeholder="Link Title"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-slate-200 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
          />
          <input
            type="text"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-slate-200 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            {editingIndex !== -1 ? "Save Changes" : "Add Link"}
          </button>
        </form>
      )}

      {/* Button to toggle the form */}
      <button
        onClick={handleToggleForm}
        className={`absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 transition-transform duration-300 ease-in-out ${
          isFormOpen ? "rotate-45" : ""
        }`}
      >
        <Plus size={24} />
      </button>

      {/* Message box for errors */}
      {errorMessage && (
        <p className="mt-4 text-sm text-center text-red-400">{errorMessage}</p>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20 rounded-2xl">
          <div className="bg-slate-700 p-6 rounded-xl shadow-lg text-center border border-red-500">
            <p className="text-lg font-semibold mb-4 text-slate-100">
              Are you sure you want to delete this link?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksWidget;
