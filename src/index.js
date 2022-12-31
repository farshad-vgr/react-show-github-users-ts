import React, { Suspense, useState, createContext, useCallback } from "react";
import ReactDOM from "react-dom/client";
import Scroll from "./Scroll";
import SearchBox from "./SearchBox";
import Loading from "./Loading";
import "./index.css";
const App = React.lazy(() => import("./App"));

export const myContext = createContext();

const ComponentCombiner = () => {
  const [userName, setUserName] = useState("");

  const formSubmitHandler = useCallback((e, v) => {
    e.preventDefault();
    setUserName(v.trim());
  },[userName]);

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
