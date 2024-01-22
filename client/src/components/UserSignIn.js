import { useContext, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';
import ErrorsDisplay from './ErrorsDisplay';

const UserSignIn = () => {
    // Accessing signIn function from the context
    const { actions } = useContext(UserContext);

    // Hook for programmatic navigation
    const navigate = useNavigate();
    // Accessing the current location
    const location = useLocation();

    // Refs to store form input values
    const emailAddress = useRef(null);
    const password = useRef(null);
    // State to manage validation errors
    const [errors, setErrors] = useState([]);

    // Event handler for form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Set the default route to navigate to after sign-in
        let from = '/';
        if (location.state) {
            from = location.state.from;
        }

        // Create a credentials object with email and password
        const credentials = {
            emailAddress: emailAddress.current.value,
            password: password.current.value
        };

        try {
            // Call the signIn function to check if the user exists
            const user = await actions.signIn(credentials);
            if (user) {
                // Navigate to the specified route after successful sign-in
                navigate(from);
            } else {
                // Set an error message if sign-in was unsuccessful
                setErrors(['Sign-in was unsuccessful'])
            }
        } catch (error) {
            // Log any error and navigate to the 'error' page
            console.log(error);
            navigate('/error');
        }
    }

    // Event handler for cancel button
    const handleCancel = (event) => {
        event.preventDefault();
        // Navigate to the home page
        navigate('/');
    }

    return (
        <main>
            <div className="form--centered">
                <h2>Sign In</h2>
                {/* Display validation errors, if any */}
                <ErrorsDisplay errors={errors} />
                <form onSubmit={handleSubmit}>
                    <label htmlFor="emailAddress">Email Address</label>
                    <input
                        id="emailAddress"
                        name="emailAddress"
                        type="email"
                        ref={emailAddress}
                        placeholder="Email Address"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        ref={password}
                        placeholder="Password"
                    />
                    {/* Sign In and Cancel buttons */}
                    <button className="button" type="submit">Sign In</button>
                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
                {/* Link to sign up page */}
                <p>Don't have a user account? Click here to <Link to="/signup">sign up</Link>!</p>
            </div>
        </main>
    );
};

export default UserSignIn;
