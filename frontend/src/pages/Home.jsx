import { Link } from "react-router-dom";
import "../styles/Home.css";
import { fetchingUserMe } from "../services/auth";
import { useState } from "react";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const fetchingUser = async () => {
    console.log(Math.random(9));

    try {
      const { user } = await fetchingUserMe();
      setCurrentUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-logo">A</div>

        <h1>Welcome to AuthApp</h1>

        <p>
          Explore our authentication system. Login or create a new account to
          get started.
        </p>

        <div className="home-buttons">
          <Link to="/login" className="home-login">
            Sign In
          </Link>

          <Link to="/register" className="home-register">
            Create Account
          </Link>
        </div>

        <span className="home-footer">Simple Authentication Application</span>
      </div>

      <div>
        <button onClick={() => fetchingUser()}>Fetching User</button>
        {currentUser && <div>{currentUser.name}</div>}
      </div>
    </div>
  );
};

export default Home;
