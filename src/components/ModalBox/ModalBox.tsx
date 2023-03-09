import React, { memo, useContext } from "react";

import { myContext } from "../../index";

import "./ModalBox.css";

interface Props {
	onClose: () => void;
	title: string;
	children: JSX.Element;
}

const ModalBox = ({ onClose, title, children }: Props) => {
	const { ref, setHiddenItems } = useContext(myContext);

	return (
		<>
			<div
				className="modal-backdrop"
				onClick={(e) => {
					if (e.target === e.currentTarget && ref.current) {
						onClose();
						(ref.current as HTMLInputElement).focus();
						setHiddenItems(0);
					}
				}}>
				<div className="modal-box">
					<button
						className="modal-btn cursor-pointer"
						onClick={() => {
							onClose();
							if (ref.current) {
								(ref.current as HTMLInputElement).focus();
							}
							setHiddenItems(0);
						}}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="cursor-pointer">
							<path
								className="cursor-pointer"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</button>
					<section style={{ width: "95%" }}>
						<h3 className="modal-title">{title}</h3>
						<div className="modal-body">{children}</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default memo(ModalBox);
