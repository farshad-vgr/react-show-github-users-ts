import { memo } from "react";

import "./FoundItem.css";

interface Props {
	response: {
		avatar_url: string;
		login: string;
		html_url: string;
	};
}

const FoundItem = ({ response }: Props) => {
	return (
		<>
			<li id="found-item" className="card fade-item fadein">
				<div>
					<img src={response.avatar_url} alt="User"></img>
					<section>
						<h3>{response.login}</h3>
						<a href={response.html_url} target="_blank" rel="noreferrer">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								width="1rem"
								height="1rem"
								className="cursor-pointer">
								<path
									className="cursor-pointer"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
								/>
							</svg>
							Profile on Github
						</a>
						<span>Followers: {Math.ceil(Math.random() * response.login.length)}K</span>
					</section>
					<article>
						<b>About user:</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
						dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
					</article>
				</div>

				<div className="star-section" title="Stars">
					<svg xmlns="http://www.w3.org/2000/svg" fill="gold" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
						/>
					</svg>
					<span>{Math.ceil(Math.random() * 90)}</span>
				</div>
			</li>
		</>
	);
};

export default memo(FoundItem);
