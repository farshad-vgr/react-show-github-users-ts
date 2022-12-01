import { useState, useEffect } from "react";
import "./Scroll.css";

function Scroll() {
  const [percentScrolled, setPercentScrolled] = useState((window.scrollY / (document.body.clientHeight - window.innerHeight)) * 100);
  const [percentageText, setPercentText] = useState(percentScrolled.toFixed(1) + " %");

  const scrollHandler = () => {
    setPercentScrolled((window.scrollY / (document.body.clientHeight - window.innerHeight)) * 100);
    setPercentText(percentScrolled.toFixed(1) + " %");
  };

  useEffect(() => {
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
}

export default Scroll;
