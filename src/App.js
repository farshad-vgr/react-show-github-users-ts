import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";

import { myContext } from "./index";
import { FetchButton } from "./components";

import "./App.css";

const App = () => {
	const ul = useRef();
	const numberOfUsers = useRef(50);
	let [hiddenItems, setHiddenItems] = useState(0);
	const [requestNumber, setRequestNumber] = useState(60);
	const { userName } = useContext(myContext);

	// This function handles loading a list of users with a smooth-fading animation(adds a specific class to all items)
	function loadingAnimation() {
		const allItems = document.getElementsByClassName("fade-item");

		for (let i = 0; i < numberOfUsers.current; ++i) {
			setTimeout(() => {
				allItems[i].classList.add("fadein");
			}, i * 250);
		}
	}

	// This function handles loading users by the Axios request
	const loadUsers = useCallback(async () => {
		try {
			const response = await axios.get(`https://api.github.com/users?per_page=${numberOfUsers.current}`);
			const users = response.data;

			setRequestNumber(response.headers["x-ratelimit-remaining"]);

			for (const user of users) {
				const li = document.createElement("li");
				li.classList.add("card", "fade-item");
				li.setAttribute("draggable", "true");
				li.innerHTML = `
		            <div>
		              <img src="${user.avatar_url}" draggable="false">
		                <section>
		                  <h3>${user.login}</h3>
		                  <a href="${user.html_url}" target="_blank" draggable="false">
		                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="1rem" height="1rem" class="cursor-pointer">
		                    <path class="cursor-pointer" stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
		                  </svg>
		                  Profile on Github
		                  </a>
		                  <span>Followers: ${Math.ceil(Math.random() * user.login.length)}K</span>
		                </section>
		                <article><b>About user:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</article>
		              </div>
		            `;

				const deleterSpan = document.createElement("span");
				deleterSpan.setAttribute("class", "delete-icon");
				deleterSpan.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="cursor-pointer">
            <path class="cursor-pointer" stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
				deleterSpan.addEventListener("click", () => {
					if (window.confirm(`Are you sure you want to delete "${user.login}" from list??`)) {
						const arrayOfLi = [...ul.current.querySelectorAll("li")];

						for (const eachLi of arrayOfLi) {
							if (eachLi.querySelector("h3").innerText === `Name: ${user.login}`) {
								arrayOfLi[arrayOfLi.indexOf(eachLi)].style.display = "none";
							}
						}
					}
				});
				li.appendChild(deleterSpan);

				const starSection = document.createElement("div");
				starSection.setAttribute("title", "Stars");
				starSection.setAttribute("class", "star-section");
				starSection.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          <span>${Math.ceil(Math.random() * 90)}</span>
        `;
				li.appendChild(starSection);

				li.addEventListener("dragstart", () => {
					li.classList.add("dragging");
				});

				li.addEventListener("dragend", () => {
					li.classList.remove("dragging");
				});

				ul.current.append(li);

				loadingAnimation();
			}
		} catch (error) {
			alert(`
		    Error:
		    ${error}
		    Please refresh this page again!
		  `);
		}
	}, []);

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

	// This hook manages search to show or hide users
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
					<h1>No Item Found !</h1>
				</div>
			)}
		</section>
	);
};

export default App;
