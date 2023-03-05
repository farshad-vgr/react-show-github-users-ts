import React, { Suspense, useState, useRef, createContext } from "react";
import ReactDOM from "react-dom/client";

import { Loading, Scroll, SearchBox } from "./components";

import "./index.css";

const App = React.lazy(() => import("./App"));

export const myContext = createContext();

const ComponentCombiner = () => {
  const [ userName, setUserName ] = useState("");
  const ref = useRef(null);

	const formSubmitHandler = (e, v) => {
		e.preventDefault();
		setUserName(v.trim());
	};

	return (
		<myContext.Provider value={{ userName, formSubmitHandler, ref }}>
			<Scroll />
			<SearchBox ref={ref} />
			<Suspense fallback={<Loading />}>
				<App />
			</Suspense>
		</myContext.Provider>
	);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ComponentCombiner />);
