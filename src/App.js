import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";


import { myContext } from "./index";
import { FetchButton, Loading, NotFound } from "./components";

import useAxios from "./hooks/useAxios";
import "./App.css";

const App = () => {
	const ul = useRef();
	const numberOfUsers = useRef(10); // A number between 10 to 100
	const [hiddenItems, setHiddenItems] = useState(0); // If all items are hidden show a message("no-item-found")
	const { userName } = useContext(myContext);
	const { loadUsers, requestNumber, isLoading } = useAxios(ul, numberOfUsers); // Custom hook

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

			{isLoading && <Loading />}

			<ul ref={ul}></ul>

			{hiddenItems === numberOfUsers.current && <NotFound />}
		</section>
	);
};

export default App;
