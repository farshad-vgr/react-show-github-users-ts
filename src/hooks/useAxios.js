import { useState, useCallback } from "react";
import axios from "axios";

const useAxios = (ul, numberOfUsers) => {
	const [requestNumber, setRequestNumber] = useState(60); // Max number of requests is 60
	const [response, setResponse] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// This function handles loading a list of users with a smooth-fading animation(adds a specific class to all items)
	const loadingAnimation = useCallback(() => {
		const allItems = document.getElementsByClassName("fade-item");

		for (let i = 0; i < numberOfUsers.current; ++i) {
			setTimeout(() => {
				allItems[i].classList.add("fadein");
			}, i * 250);
		}
	}, [numberOfUsers]);

	// This function handles loading users by the Axios request
	const loadUsers = useCallback(async () => {
		try {
			setIsLoading(true);

			const result = await axios.get(`https://api.github.com/users?per_page=${numberOfUsers.current}`);

			setResponse(result.data);
      
      const users = result.data;

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
							if (eachLi.querySelector("h3").innerText === `${user.login}`) {
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="gold" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
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

				// Determining how many requests remains
				setRequestNumber(result.headers["x-ratelimit-remaining"]);
			}
		} catch (error) {
			setError(error);

			alert(`
		    Error:
		    ${error}
		    Please refresh this page again!
		  `);
		} finally {
			setIsLoading(false);
		}
	}, [ul, numberOfUsers, loadingAnimation]);

	return { loadUsers, requestNumber, response, error, isLoading };
};

export default useAxios;
