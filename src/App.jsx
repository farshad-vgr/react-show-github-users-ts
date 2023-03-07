import { useContext, useEffect, useLayoutEffect, useRef, useCallback } from "react";

import { myContext } from "./index";
import { FetchButton, Loading, NotFound, UserItem } from "./components";
import useAxios from "./hooks/useAxios";

import "./App.css";

const App = () => {
	const ul = useRef(); // Main "ul" element as container for "li" items

	const { numberOfUsers, hiddenItems, setHiddenItems, userName } = useContext(myContext); // Search input value

	const { loadUsers, requestNumber, response, isLoading } = useAxios(numberOfUsers); // Custom hook

	// This function handles loading effect for a list of users with a smooth-fading animation(adds a specific class to all list items)
	const loadingAnimation = useCallback(() => {
		const allItems = document.getElementsByClassName("fade-item");

		for (let i = 0; i < numberOfUsers.current; ++i) {
			setTimeout(() => {
				allItems[i].classList.add("fadein");
			}, i * 250);
		}
	}, [numberOfUsers]);

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
	}, [userName, setHiddenItems]);

	return (
		<section className="container">
			<FetchButton loadUsers={loadUsers} requestNumber={requestNumber} page={1} />

			{isLoading && <Loading />}

			<ul ref={ul}>
				{response && response.map((user) => <UserItem key={user.id} user={user} ul={ul} />)}
				{response && loadingAnimation()}
			</ul>

			{hiddenItems === numberOfUsers.current && <NotFound />}
		</section>
	);
};

export default App;
