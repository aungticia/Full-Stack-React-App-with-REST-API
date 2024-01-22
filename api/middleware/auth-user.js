'use strict';
const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    let message; 

    // user's credentials from the Authorization header.
    const credentials = auth(req); 
    if (credentials) {
        const user = await User.findOne({ 
            where: {
                emailAddress: credentials.name
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        if (user) {
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            // match the passwords
            if (authenticated) {
                console.log(`Authentication successful for user: ${credentials.name}`);
            
                // hides password 
                const updateUser = {
                    id: user.id, 
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress
                }
                req.currentUser = updateUser; 

            } else {
                message = `Authentication failure for user: ${credentials.name}`;
            }
        } else {
            message = `User not found for email: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
    // check if user authentication failed...
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
   
}