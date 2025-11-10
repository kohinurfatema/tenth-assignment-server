const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 5000; // Using 5000 as default

// 🚨 ADMIN SDK INITIALIZATION 
// IMPORTANT: Replace the path/filename below with your actual Firebase Admin key file
const serviceAccount = require("./eco-track-firebase-admin-key.json"); 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


// ------------------------------------
//          MIDDLEWARE
// ------------------------------------
app.use(cors());
app.use(express.json())

const logger = (req, res, next) => {
    console.log('Request received:', req.method, req.path);
    next();
}


// Middleware to verify Firebase ID Token (for primary authentication)
const verifyFireBaseToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    
    try {
        const userInfo = await admin.auth().verifyIdToken(token);
        req.user_email = userInfo.email; 
        req.user_uid = userInfo.uid; 
        next();
    }
    catch {
        return res.status(401).send({ message: 'unauthorized access' })
    }
}