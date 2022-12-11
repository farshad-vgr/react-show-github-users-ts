import React, { useState } from "react";
import "./SearchBox.css";

const SearchBox = ({ formSubmitHandler }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div>
      <form
        className="searchbox-form"
        onSubmit={(e) => {
          formSubmitHandler(e, searchValue);
          setSearchValue("");
        }}>
        <input
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
    </div>
  );
};

export default SearchBox;
