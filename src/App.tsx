import { useContext, useEffect, useLayoutEffect, useRef, useCallback } from "react";

import { myContext } from "./index";
import { FetchButton, Loading, NotFound, UserItem } from "./components";
import useAxios from "./hooks/useAxios";

import "./App.css";

interface Response {
	id: number;
	login: string;
	avatar_url: string;
	html_url: string;
}

const App = () => {
	const ul = useRef<HTMLUListElement | null>(null); // Main "ul" element as container for "li" items

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
	function dragEnterHandler(e: DragEvent) {
		if ((e.target as HTMLElement).classList.contains("card") && !(e.target as HTMLElement).classList.contains("dragging")) {
			const draggingCard = document.querySelector(".dragging") as HTMLLIElement;
			const cards = [...(ul.current as Element).querySelectorAll("li")];
			const currentPosition = cards.indexOf(draggingCard);
			const newPosition = cards.indexOf(e.target as HTMLLIElement);

			if (currentPosition > newPosition) {
				(ul.current as Element).insertBefore(draggingCard, e.target as Element);
			} else {
				(ul.current as Element).insertBefore(draggingCard, (e.target as HTMLElement).nextSibling);
			}
		}
	}

	// This function changes the mouse icon when drag and drop happens
	function dragOverHandler(e: DragEvent) {
		e.preventDefault();
	}

	// This hook manages drag and drop on itmes
	useEffect(() => {
		const currentUl: HTMLUListElement | null = ul.current;

		function eventListeners() {
			currentUl?.addEventListener("dragenter", (e) => dragEnterHandler(e));
			currentUl?.addEventListener("dragover", (e) => dragOverHandler(e));
		}
		eventListeners();

		return () => {
			currentUl?.removeEventListener("dragenter", (e) => dragEnterHandler(e));
			currentUl?.removeEventListener("dragover", (e) => dragOverHandler(e));
		};
	}, [loadUsers]);

	// This hook manages search value to show or hide users
	useLayoutEffect(() => {
		setHiddenItems(0);

		const arrayOfLi = [...(ul.current as Element).querySelectorAll("li")];

		arrayOfLi.forEach((li) => {
			if (li.querySelector("h3")?.innerText.toLowerCase().includes(userName)) {
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
				{response && (response as Array<Response>).map((user) => <UserItem key={user.id} user={user} ul={ul} />)}
				{response && loadingAnimation()}
			</ul>

			{hiddenItems === numberOfUsers.current && <NotFound />}
		</section>
	);
};

export default App;
