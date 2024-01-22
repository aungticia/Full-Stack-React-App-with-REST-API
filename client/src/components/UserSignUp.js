import { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/apiHelper';

import UserContext from '../context/UserContext';
import ErrorsDisplay from './ErrorsDisplay';

const UserSignUp = () => {
    // Accessing actions and signIn function from the context
    const { actions } = useContext(UserContext);
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Refs to store form input values
    const firstName = useRef(null);
    const lastName = useRef(null);
    const emailAddress = useRef(null);
    const password = useRef(null);
    // State to manage validation errors
    const [errors, setErrors] = useState([]);

    // Event handler for form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Create a user object with information from the form
        const user = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            emailAddress: emailAddress.current.value,
            password: password.current.value
        }

        // Send a POST request to create a new user
        try {
            const response = await api("/users", "POST", user);
            // Check if the response status is 201 (Created)
            if (response.status === 201) {
                console.log(`${user.firstName} ${user.lastName} is successfully signed up and authenticated!`)
                // Sign in the new user after successful sign-up
                await actions.signIn(user);
                // Navigate to the home page
                navigate('/');
            } else if (response.status === 400) {
                // If there are validation errors, set them in the state
                const data = await response.json();
                setErrors(data.errors);
            } else {
                // If the response status is neither 201 nor 400, throw an error
                throw new Error();
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
                <h2>Sign Up</h2>
                {/* Display validation errors, if any */}
                <ErrorsDisplay errors={errors} />
                <form onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        ref={firstName}
                        placeholder="First Name"
                    />
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        ref={lastName}
                        placeholder="Last Name"
                    />
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
                    {/* Sign Up and Cancel buttons */}
                    <button className="button" type="submit">Sign Up</button>
                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
                {/* Link to sign in page */}
                <p>Already have a user account? Click here to <Link to="/signin">sign in</Link>!</p>
            </div>
        </main>
    );
};

export default UserSignUp;
