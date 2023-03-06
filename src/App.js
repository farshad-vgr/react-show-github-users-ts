import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";


import { myContext } from "./index";
import { FetchButton } from "./components";

import useAxios from "./hooks/useAxios";
import "./App.css";

const App = () => {
	const ul = useRef();
	const numberOfUsers = useRef(10); // A number between 10 to 100
	const [hiddenItems, setHiddenItems] = useState(0); // If all items are hidden show a message("no-item-found")
	const { userName } = useContext(myContext);
	const { loadUsers, requestNumber } = useAxios(ul, numberOfUsers); // Custom hook

	// This function handles drag and drop event
	function dragEnterHandler(e) {
		if (e.target.classList.contains("card") && !e.target.classList.contains("dragging")) {
			const draggingCard = document.querySelector(".dragging");
			const cards = [...ul.current.querySelectorAll("li")];
			const currentPosition = cards.indexOf(draggingCard);
			const newPosition = cards.indexOf(e.target);

			if (currentPosition > newPosition) {
				ul.current.insertBefore(draggingCard, e.target);
			} else {
				ul.current.insertBefore(draggingCard, e.target.nextSibling);
			}
		}
	}

	// This function changes the mouse icon when drag and drop happens
	function dragOverHandler(e) {
		e.preventDefault();
	}

	// This hook manages drag and drop on itmes
	useEffect(() => {
		const currentUl = ul.current;

		function eventListeners() {
			currentUl.addEventListener("dragenter", (e) => dragEnterHandler(e));
			currentUl.addEventListener("dragover", (e) => dragOverHandler(e));
		}
		eventListeners();

		return () => {
			currentUl.removeEventListener("dragenter", dragEnterHandler);
			currentUl.removeEventListener("dragover", dragOverHandler);
		};
	}, [loadUsers]);

	// This hook manages search value to show or hide users
	useLayoutEffect(() => {
		setHiddenItems(0);

		const arrayOfLi = [...ul.current.querySelectorAll("li")];

		arrayOfLi.forEach((li) => {
			if (li.querySelector("h3").innerText.toLowerCase().includes(userName)) {
				li.style.display = "block";
			} else {
				li.style.display = "none";
				setHiddenItems((prevHiddenItems) => prevHiddenItems + 1);
			}
		});
	}, [userName]);

	return (
		<section className="container">
			<FetchButton loadUsers={loadUsers} requestNumber={requestNumber} />

			<ul ref={ul} id="my-ul"></ul>

			{hiddenItems === numberOfUsers.current && (
				<div className="no-item">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" width="4rem" height="4rem" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
						/>
					</svg>
					<h1>No Item Found !</h1>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" width="4rem" height="4rem" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
						/>
					</svg>
				</div>
			)}
		</section>
	);
};

export default App;
