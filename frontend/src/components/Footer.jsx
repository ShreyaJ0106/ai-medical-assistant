import {
  FaReact,
  FaNodeJs
} from "react-icons/fa";

import { SiExpress, SiN8N, SiGooglegemini } from "react-icons/si";

import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <p>Built with</p>

      <div className="tech-stack">

        <span>
          <FaReact /> React
        </span>

        <span>
          <FaNodeJs /> Node.js
        </span>

        <span>
          <SiExpress /> Express
        </span>

        <span>
          <SiN8N /> n8n
        </span>

        <span>
          <SiGooglegemini /> Gemini AI
        </span>

      </div>

    </footer>
  );
}

export default Footer;