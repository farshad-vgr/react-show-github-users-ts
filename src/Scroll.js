import { useState, useEffect } from "react";
import "./Scroll.css";

function Scroll() {
  const [percentScrolled, setPercentScrolled] = useState(0);
  const [percentageText, setPercentText] = useState("");
  const [scrollVisibility, setScrollVisibility] = useState("");

  const scrollHandler = () => {
    setPercentScrolled((window.scrollY / (document.body.clientHeight - window.innerHeight)) * 100);

    if (percentScrolled.toFixed(0) >= 3) {
      setScrollVisibility("visible");
      setPercentText(percentScrolled.toFixed(1) + " %");
    } else {
      setScrollVisibility("hidden");
    }
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
      <span style={{ visibility: scrollVisibility }}>{percentageText}</span>
    </div>
  );
}

export default Scroll;
