import Logo from "../Logo/Logo";
import Nav from "../Nav/Nav";
import "./header.css";
function Header() {
  return (
    <div>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
        style={{ backgroundColor: "#E4EBF3" }}
      >
        <Logo />
        <Nav />
      </header>
    </div>
  );
}

export default Header;
