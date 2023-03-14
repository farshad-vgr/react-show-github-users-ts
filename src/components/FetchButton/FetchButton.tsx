import React, { useContext } from "react";

import { myContext } from "../../index";

import "./FetchButton.css";

interface Props {
	loadUsers: (page: number) => Promise<void>;
	requestNumber: string | undefined;
	page: number;
}

const FetchButton = ({ loadUsers, requestNumber, page }: Props) => {
	const { ref } = useContext(myContext);

	return (
		<>
			<button
				id="fetch-btn"
				className="tour-fetch-button"
				onClick={(e) => {
					loadUsers(page);
					e.currentTarget.disabled = true;
					e.currentTarget.style.pointerEvents = "none";
					e.currentTarget.style.userSelect = "none";
					if (ref.current) {
						(ref.current as HTMLElement).focus();
					}
				}}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					width="1.5rem"
					height="1.5rem"
					className="cursor-pointer">
					<path
						className="cursor-pointer"
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
					/>
				</svg>
				Download Data (Limited Requests: {requestNumber}/60)
			</button>
		</>
	);
};

export default FetchButton;
