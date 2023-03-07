import React, { useState, useContext, forwardRef } from "react";

import { myContext } from "../../index";

import "./SearchBox.css";

const SearchBox = forwardRef((props, ref) => {
	const [searchValue, setSearchValue] = useState("");
	const { formSubmitHandler, setShowModal, findUser } = useContext(myContext);

	return (
		<section>
			<form
				className="searchbox-form"
				onSubmit={(e) => {
					e.preventDefault();
					setSearchValue("");
					setShowModal(true);
					findUser(searchValue);
				}}>
				<input
					ref={ref}
					type={"text"}
					maxLength={15}
					value={searchValue}
					onInput={(e) => {
						setSearchValue(e.target.value);
					}}
					onChange={(e) => {
						formSubmitHandler(e, e.target.value);
					}}></input>
				<input type={"submit"} value="Search"></input>
			</form>
		</section>
	);
});

export default SearchBox;
