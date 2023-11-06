import { Form, useNavigation } from "@remix-run/react";
// import styles from './newNote.css';


// this component uses the traditional HTML form
// when this form is submitted, it refreshes the page which then causes a new call to the server
// a new server call means that the browser might re-download files, like js, css, etc
// function NewNote() {
//   return (
//     <form method="post" id="note-form">
//       <p>
//         <label htmlFor="title">Title</label>
//         <input type="text" id="title" name="title" required />
//       </p>
//       <p>
//         <label htmlFor="content">Content</label>
//         <textarea id="content" name="content" rows="5" required />
//       </p>
//       <div className="form-actions">
//         <button>Add Note</button>
//       </div>
//     </form>
//   );
// }


// in order to prevent an additional unnecessary call to the server when the
// form is submitted, use this <Form /> component
// this component comes from Remix
// when this form is submitted, the page will not refresh- it acts like a SPA
function NewNote(props) {

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Form method="post" id="note-form">
      {props.actionData?.error_msg && <p>{props.actionData.error_msg}</p>}
      <p>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </p>
      <p>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows="5" required />
      </p>
      <div className="form-actions">
        <button disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Note"}</button>
      </div>
    </Form>
  );
}


export default NewNote;

// export function links() {
//   return [{ rel: 'stylesheet', href: styles }];
// }