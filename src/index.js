import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
import Scroll from "./Scroll";

const root = ReactDOM.createRoot(document.getElementById("root"));

// if a component is heavy to load and show it is better to use 'lazy loading' to show that component
const App = React.lazy(() => import("./App"));

root.render(
  <>
    <Scroll />
    {/* have a spinner animation until content show, using this props: fallback={<Spinner />} inside Suspense*/}
    <Suspense>
      <App />
    </Suspense>
  </>,
);
