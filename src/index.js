import React, { Suspense, useState, useRef, createContext } from "react";
import ReactDOM from "react-dom/client";

import { Loading, Scroll, SearchBox, ModalBox, FoundItem } from "./components";
import useFindUser from "./hooks/useFindUser";

import "./index.css";

const App = React.lazy(() => import("./App"));

export const myContext = createContext();

const ComponentCombiner = () => {
	const [ userName, setUserName ] = useState("");
	
	const ref = useRef(null);

	const numberOfUsers = useRef(10); // How many user to show(between 10 to 100)

	const [hiddenItems, setHiddenItems] = useState(0); // If all items are hidden, then show a message("no-item-found")

	// Show a modal when the user wants to find a user
	const [showModal, setShowModal] = useState(false);

	const { findUser, response } = useFindUser();

	const formSubmitHandler = (e, v) => {
		e.preventDefault();
		setUserName(v.trim());
	};

	return (
		<myContext.Provider value={{ numberOfUsers, hiddenItems, setHiddenItems, userName, formSubmitHandler, ref, setShowModal, findUser, response }}>
			<Scroll />

			<SearchBox ref={ref} />

			<Suspense fallback={<Loading />}>
				<App />
			</Suspense>

			{showModal && (
				<ModalBox onClose={() => setShowModal(false)} title="Search Result :">
					{response ? <FoundItem response={response} /> : <p id="modal-message">User Not Found !!</p>}
				</ModalBox>
			)}
		</myContext.Provider>
	);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ComponentCombiner />);
