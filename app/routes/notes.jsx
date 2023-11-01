import NewNote from "../components/NewNote";
import newNoteStyles from "../components/NewNote.css";
import NoteList from "../components/NoteList";
import noteListStyles from "../components/NoteList.css";
import { getStoredNotes, storeNotes } from "../data/notes";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const notes = await getStoredNotes();
  return notes;
}

const Notes = () => {

  const notes = useLoaderData();

  return (
    <main>
      <h1>My Notes</h1>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  )
}

export default Notes;

export function links() {
  return [
    {rel: "stylesheet", href: newNoteStyles},
    {rel: "stylesheet", href: noteListStyles}
  ];
}

// backend server code that gets the form data and adds it to the JSON file
export async function action(data) {
  console.log('---DATA', data); // this appears in the "server side" console AKA in the code editor terminal
  const formData = await data.request.formData();

  // this is one way to get the values from the form fields
  // 'title' and 'content' come from the form's input 'name' attrs
  // const noteData = {
  //   title: formData.get('title'),
  //   content: formData.get('content')
  // }

  // this is another way to get the form values
   const noteData = Object.fromEntries(formData);

  console.log('---NOTE DATA', noteData);

  const currentNotes = await getStoredNotes();
  console.log('---CURRENT NOTES', currentNotes);
  noteData.id = new Date().toISOString();

  const updatedNotes = currentNotes.concat(noteData);

  console.log('---UPDATED NOTES', updatedNotes);

  await storeNotes(updatedNotes);

  return redirect("/notes");
}