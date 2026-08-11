import { FaHospital } from "react-icons/fa";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">

      <div className="header-content">

        <FaHospital className="hospital-icon" />

        <h1>AI Medical Assistant</h1>

        <p>
          AI-powered Preliminary Health Assessment
        </p>

      </div>

    </header>
  );
}

export default Header;