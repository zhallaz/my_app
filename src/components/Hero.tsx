import "./Header";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
const Hero = () => {
  return (
    <div className="hero">
      <div className="typography">Welcome to my app</div>
      <h6 className="typography">
        <button>
          <Link to="/blog"> get started</Link>
        </button>
      </h6>
    </div>
  );
};
export default Hero;
