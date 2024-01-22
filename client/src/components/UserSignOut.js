import { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { Navigate } from "react-router-dom";

const UserSignOut = () => {
    const { actions } = useContext(UserContext);

    // signs out user when button is pressed
    useEffect(() => actions.signOut());

    return <Navigate to='/' replace />

}

export default UserSignOut