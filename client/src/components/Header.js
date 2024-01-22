import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const Header = () => {
    const { authUser } = useContext(UserContext);

    // returns a header depending if user is signed in or not 
    return (
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><Link to="/">Courses</Link></h1>
                <nav>
                    <ul className="header--signedout">
                    {authUser === null ?
                        <>
                            <li><Link to="/signup">Sign up</Link></li>
                            <li><Link to="/signin">Sign in</Link></li>
                        </>
                        :
                        <>
                            <li><span>Welcome, {authUser.firstName} {authUser.lastName}!</span></li>
                            <li><Link className="signout" to="/signout">Sign out</Link></li>
                        </>
                    }
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header; 