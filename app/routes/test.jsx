import { Link } from "@remix-run/react";

export default function Test() {
  return (
    <>
      <h1>Test Page</h1>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat vero adipisci quasi?</p>
      <Link to="/">go to home</Link>
    </>
  )
}