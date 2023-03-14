import React, { Suspense, useState, useRef, createContext, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { Loading, Scroll, SearchBox, ModalBox, FoundItem, JoyRideTour } from "./components";
import useFindUser from "./hooks/useFindUser";

import "./index.css";

const App = React.lazy(() => import("./App"));

interface MyContext {
	numberOfUsers: React.MutableRefObject<number>;
	hiddenItems: number;
	setHiddenItems: (a: number | ((b: number) => number)) => void;
	userName: string;
	formSubmitHandler: (e: React.ChangeEvent<HTMLInputElement>, v: string) => void;
	ref: React.MutableRefObject<null>;
	setShowModal: (b: boolean) => void;
	findUser: (str: string) => void;
	response: {} | null;
}

export const myContext = createContext<MyContext>({
	numberOfUsers: {current: 0},
	hiddenItems: 0,
	setHiddenItems: () => {},
	userName: "",
	formSubmitHandler: () => {},
	ref: {current: null},
	setShowModal: () => {},
	findUser: () => {},
	response: {},
});

const ComponentCombiner = () => {
	const [userName, setUserName] = useState<string>("");

	const ref = useRef(null);

	const numberOfUsers = useRef<number>(10); // How many user to show(between 10 to 100)

	const [hiddenItems, setHiddenItems] = useState(0); // If all items are hidden, then show a message("no-item-found")

	// Show a modal when the user wants to find a user
	const [showModal, setShowModal] = useState(false);

	const { findUser, response } = useFindUser();

	const formSubmitHandler = (e: React.ChangeEvent<HTMLInputElement>, v: string) => {
		e.preventDefault();
		setUserName(v.trim());
	};

	// This hook checks if this is the first time shown tour to the user or not
	useEffect(() => {
		if (!localStorage.getItem("showGithubUsersTour")) {
			document.body.addEventListener(
				"click",
				() => {
					localStorage.setItem("showGithubUsersTour", "true");
				},
				{ once: true },
			);

			return () => document.body.removeEventListener("click", () => localStorage.setItem("showGithubUsersTour", "true"));
		}
	}, []);

	return (
		<myContext.Provider value={{ numberOfUsers, hiddenItems, setHiddenItems, userName, formSubmitHandler, ref, setShowModal, findUser, response }}>
			<Scroll />

			<SearchBox ref={ref} />

			<Suspense fallback={<Loading />}>
				<App />
			</Suspense>

			{!localStorage.getItem("showGithubUsersTour") && <JoyRideTour />}

			{showModal && (
				<ModalBox onClose={() => setShowModal(false)} title="Search Result :">
					{response ? <FoundItem response={response} /> : <p id="modal-message">User Not Found !!</p>}
				</ModalBox>
			)}
		</myContext.Provider>
	);
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement);
root.render(<ComponentCombiner />);
