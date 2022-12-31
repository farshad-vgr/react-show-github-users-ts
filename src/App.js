import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { myContext } from "./index";
import "./App.css";

const App = () => {
  const ul = useRef();
  let [hiddenItems, setHiddenItems] = useState(0);
  const value = useContext(myContext);

  //------------ loading list of users with a smooth fading animation ------------------
  function loadingAnimation() {
    const items = document.getElementsByClassName("fade-item");

    for (let i = 0; i < items.length; ++i) {
      setTimeout(() => {
        items[i].classList.add("fadein");
      }, i * 250);
    }
  }

  //-------------------- loading user by AJAX request ---------------------
  function loadUsers() {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "https://api.github.com/users");

    xhr.onload = function () {
      if (xhr.status == 200) {
        const users = JSON.parse(xhr.responseText);

        for (const user of users) {
          const li = document.createElement("li");
          li.classList.add("card", "fade-item");
          li.setAttribute("draggable", "true");
          li.innerHTML = `
          <div>
            <img src="${user.avatar_url}" draggable="false">
              <section>
                <h3>Name: ${user.login}</h3>
                <a href="${user.html_url}" target="_blank" draggable="false">Visit profile on Github!</a>
                <span>Followers: ${Math.ceil(Math.random() * user.login.length)}K</span>
              </section>
              <article><b>About user:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</article>
            </div>
          `;

          const deleterSpan = document.createElement("span");
          deleterSpan.setAttribute("title", "Delete user!");
          deleterSpan.setAttribute("class", "delete-icon");
          deleterSpan.innerText = "X";
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

          li.addEventListener("dragstart", () => {
            li.classList.add("dragging");
          });

          li.addEventListener("dragend", () => {
            li.classList.remove("dragging");
          });

          ul.current.append(li);

          loadingAnimation();
        }
      }
    };

    xhr.send();
  }

  //--------------- drag and drop listener -----------------------
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

  //------------ change mouse icon when drag and drop happed -----------------------
  function dragOverHandler(e) {
    e.preventDefault();
  }

  useEffect(() => {
    loadUsers();

    function eventListeners() {
      ul.current.addEventListener("dragenter", (e) => dragEnterHandler(e));
      ul.current.addEventListener("dragover", (e) => dragOverHandler(e));
    }
    eventListeners();

    return () => {
      ul.current.removeEventListener("dragenter", dragEnterHandler);
      ul.current.removeEventListener("dragover", dragOverHandler);
    };
  }, []);

  useLayoutEffect(() => {
    setHiddenItems(0);
    const arrayOfLi = [...ul.current.querySelectorAll("li")];
    arrayOfLi.forEach((li) => {
      if (li.querySelector("h3").innerText.toLowerCase().includes(value)) {
        li.style.display = "block";
      } else {
        li.style.display = "none";
        setHiddenItems((prevHiddenItems) => prevHiddenItems + 1);
      }
    });
  }, [value]);

  return (
    <section className="container">
      <ul ref={ul} id="my-ul"></ul>
      {hiddenItems === 30 && (
        <div className="no-item">
          <h1>No Items Found!</h1>
        </div>
      )}
    </section>
  );
}

export default App;
