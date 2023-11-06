import NewNote from "../components/NewNote";
import newNoteStyles from "../components/NewNote.css";
import NoteList from "../components/NoteList";
import noteListStyles from "../components/NoteList.css";
import { getStoredNotes, storeNotes } from "../data/notes";
import { redirect, json } from "@remix-run/node";
import { useLoaderData, useActionData, useRouteError, Link, isRouteErrorResponse } from "@remix-run/react";


// loader() is not client side code
// load data from the server
export async function loader() {
  console.log('---LOADER');
  const notes = await getStoredNotes();
  // action() and loader() can return data that gets 
  // exposed to the frontend and can be accessed from within the component
  // useLoaderData()
  return notes;
}


// COMPONENT
const Notes = () => {

  const notes = useLoaderData();

  console.log('---NOTES', notes);

  // TODO: learn how to display this - it changed in V2 and is now handled via ErrorBoundary() but I'm
  // unable to get this text to appear on the screen - it was previously handled via CatchBoundary()
  if (!notes || notes.length < 1) {
    throw json(
      {error_message: "We were unable to find any notes."},
      {status: 404, statusText: "Not Found"}
    )
  }

  // I think it makes sense to use useActionData() in the
  // same file as the action() fn but it's not necessary. It can
  // also be used in any component. The component will receive
  // data from the nearest useAction(). I think that could get 
  // confusing though so I think it's better to keep it all contained here
  // ref: Remix Udemy course by Acemind, "Validating Input & Returning Data in action()"
  const actionData = useActionData();

  console.log('---ACTION DATA', actionData);

  return (
    <main>
      <h1>My Notes</h1>
      <NewNote actionData={actionData} />
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

// backend server code that is called when the form, from NewNote.jsx, is submitted
// it gets the form data and adds it to the JSON file
// action() is not client side code
export async function action(data) {
  console.log('---DATA', data); // this console log appears in the "server side" console, i.e. in the code editor terminal
  const formData = await data.request.formData();

  // this is one way to get the values from the form fields
  // 'title' and 'content' come from the form's input 'name' attrs
  // const noteData = {
  //   title: formData.get('title'),
  //   content: formData.get('content')
  // }

  // this is another way to get the form values
  const noteData = Object.fromEntries(formData);

  // validation
  if (noteData.title.length < 6) {
    // action() and loader() can return data that gets 
    // exposed to the frontend and can be accessed from within the component
    // useActionData()
    return {error_msg: "Error: Title must be more than six characters"};
  }

  console.log('---NOTE DATA', noteData);

  const currentNotes = await getStoredNotes();
  console.log('---CURRENT NOTES', currentNotes);
  noteData.id = new Date().toISOString();

  const updatedNotes = currentNotes.concat(noteData);

  console.log('---UPDATED NOTES', updatedNotes);

  // artificially pausing submit process so that that submit status can be seen on the submit button
  await new Promise((Resolve, Reject) => setTimeout(() => Resolve(), 2000));

  await storeNotes(updatedNotes);

  return redirect("/notes");
}


// ERROR HANDLING
export function ErrorBoundary() {

  const error = useRouteError();
  console.log('---ROUTE ERROR DATA', error);

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  return (
    <main className="error">
      <h1>There was a problem retrieving the notes.</h1>
      <p>{error.message}</p>
      <p>Return to the <Link to='/'>Homepage</Link></p>
    </main>
  )
}

// CatchBoundary() has been deprecated - all uncaught errors are handled by ErrorBoundary()
// export function CatchBoundary() {}