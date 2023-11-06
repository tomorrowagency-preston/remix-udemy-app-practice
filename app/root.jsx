import { cssBundleHref } from "@remix-run/css-bundle";

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from "@remix-run/react";

import MainNavigation from "./components/MainNav";

import styles from './styles/main.css';

export const links = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  {rel: "stylesheet", href: styles}
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}


// build your own error page, instead of using the default browser error page
// this will run whenever an uncaught error is thrown, from 
// anywhere in the app - which is why is should be in the root.jsx route
// this is a component, so it should use the same component syntax as the other components
// note that <Outlet /> has been removed and different HTML is being returned
// simulate an error by renaming notes.json so that it causes a crash wne going to the notes page (AKA route)
// note that because this is in the root route, it rebuilds the whole page, but if
// it is used within a component then it doesn't need to rebuild the whole page because it would
// only replace the content of the component with the error message and would get
// rendered via <Outlet /> in the App() component
// see ErrorBoundary() in Notes.jsx for another example
// also note that ErrorBoundary() is built in and does not need to be imported
export function ErrorBoundary() {

  const error = useRouteError();
  console.log('---DEFAULT ERROR BOUNDARY HOOK DATA', error);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>An error has occurred!</title>
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <main className="error">
          <h1>Oh no! An error has occurred!</h1>
          <p>{error.message}</p>
          <p>Return to the <Link to='/'>Homepage</Link></p>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}