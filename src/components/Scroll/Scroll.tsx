import { useState, useEffect, memo } from "react";
import "./Scroll.css";

const Scroll = () => {
	const [percentScrolled, setPercentScrolled] = useState(0);
	const [percentageText, setPercentText] = useState("0 %");

	useEffect(() => {
		const scrollHandler = () => {
			setPercentScrolled((window.scrollY / (document.body.clientHeight - window.innerHeight)) * 100);
			setPercentText(percentScrolled.toFixed(1) + " %");
		};

		function watchScroll() {
			window.addEventListener("scroll", scrollHandler);
		}
		watchScroll();

		return () => window.removeEventListener("scroll", scrollHandler);
	}, [percentScrolled]);

	return (
		<div id="scroll-line" style={{ width: percentScrolled + "%" }}>
			<span>{percentageText}</span>
		</div>
	);
};

export default memo(Scroll);
