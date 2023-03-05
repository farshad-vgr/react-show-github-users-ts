import React, { Suspense, useState, createContext, useCallback } from "react";
import ReactDOM from "react-dom/client";

import { Loading, Scroll, SearchBox } from "./components";

import "./index.css";

const App = React.lazy(() => import("./App"));

export const myContext = createContext();

const ComponentCombiner = () => {
  const [userName, setUserName] = useState("");

  const formSubmitHandler = useCallback((e, v) => {
    e.preventDefault();
    setUserName(v.trim());
  },[]);

  return (
    <myContext.Provider value={userName}>
      <Scroll />
      <SearchBox formSubmitHandler={formSubmitHandler} />
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </myContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ComponentCombiner />);
