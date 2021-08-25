import React, { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import noteServices from "./services/notes";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const updateNotes = () => {
    console.log("getting notes");
    noteServices.getAll().then((initialNotes) => {
      setNotes(initialNotes);
      console.log("notes updated");
    });
  };

  useEffect(updateNotes, []);
  console.log("render", notes.length, "notes");

  // Event Handler -> Adds a note to the notes state variable
  const addNote = (event) => {
    console.log("adding note to db");
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString,
      important: Math.random() < 0.5,
    };

    noteServices.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  // Event Handler -> updates the value of the input field of the form
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  // Event handler -> Toggles importance button on each item and updates the json server value
  const handlebuttonToggle = (id) => {
    const note = notes.find((n) => n.id === id);
    // update the important flag to whatever it isnt current
    const changedNote = { ...note, important: !note.important };

    // pass the updated note to the api
    noteServices
      .update(id, changedNote)
      .then((returnedNote) => {
        // update the notes list in react
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        // if we were unable to update the note with the server show and error message
        setErrorMessage(
          `the note '${note.content}' was already deleted from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  // holds the notes to be shownbra
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit" onClick={addNote}>
        save note
      </button>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? "Important" : "All"}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => handlebuttonToggle(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default App;
