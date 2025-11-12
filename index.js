const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rufixhv.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('EcoTrack Server is running...');
});

app.listen(port, () => {
    console.log(`EcoTrack server is running on port: ${port}`);
});// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth';

// 🚨 CRITICAL FIX: The import path is corrected to match your file name 'firebase.config.js'
import { auth } from '../firebase/firebase.config'; 

const AuthContext = createContext();

// Custom hook to use the Auth context easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    // 1. Authentication Status Listener (runs once on mount)
    useEffect(() => {
        // This function sets up a real-time listener for the user's sign-in state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false); // Stop loading once the initial check is done
        });

        // Cleanup function to detach the listener when the component unmounts
        return unsubscribe;
    }, []);


    // 2. Authentication Functions
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };

    // Updated register function to accept and apply name and photoURL
    const register = async (email, password, name, photoURL) => { 
        // 1. Create the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 2. Update the user profile with name and photo URL
        await updateProfile(userCredential.user, {
            displayName: name,
            photoURL: photoURL || null // Use provided URL or null
        });

        // The onAuthStateChanged listener will automatically pick up the updated user details
        return userCredential;
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email) => sendPasswordResetEmail(auth, email);


    const value = {
        currentUser,
        login,
        loginWithGoogle,
        register,
        logout,
        resetPassword,
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-success" aria-label="Loading application" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};