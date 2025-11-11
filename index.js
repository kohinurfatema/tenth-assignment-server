// ===================================
// 1. Imports and Setup
// ===================================
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// Firebase Admin Setup (for authentication middleware)
const admin = require('firebase-admin');
const serviceAccount = require("./eco-track-firebase-admin-key.json"); // Your admin key file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 5000;

// ===================================
// 2. Middleware
// ===================================
app.use(cors({
    origin: [
        'http://localhost:5173', // Your frontend URL for development
        // Add your production frontend URL here when deploying
    ],
    credentials: true,
}));
app.use(express.json());

// ===================================
// 3. MongoDB Connection
// ===================================
const uri = process.env.MONGO_URI; 

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// ===================================
// 4. JWT Middleware (Reusable function for route protection)
// ===================================
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' });
    }
    const token = authHeader.split(' ')[1];
    
    // Replace 'your-jwt-secret' with the actual secret from your .env
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            return res.status(401).send({ message: 'Forbidden Access' });
        }
        req.decoded = decoded;
        next();
    });
};


// ===================================
// 5. Main Run Function (CRITICAL: All APIs MUST be defined here)
// ===================================
async function run() {
    try {
        // Connect the client to the server (MANDATORY FIX)
        await client.connect();
        console.log("MongoDB connected successfully!");

        // Define Collections
        const db = client.db('ecoTrackDB');
        const challengesCollection = db.collection('challenges');
        const usersCollection = db.collection('users');
        const tasksCollection = db.collection('tasks');

        // ------------------------------------
        // A. JWT Generation API
        // ------------------------------------
        app.post('/api/auth/jwt', async (req, res) => {
            const user = req.body;
            // Use your actual secret from the .env file
            const token = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            res.send({ token });
        });

        // ------------------------------------
        // B. CHALLENGES API (Fix for 404 error)
        // ------------------------------------
        
        // GET ALL CHALLENGES (FIXES 404 ERROR)
        app.get('/api/challenges', async (req, res) => {
            try {
                const cursor = challengesCollection.find({});
                const result = await cursor.toArray();
                res.send(result);
            } catch (error) {
                console.error("Error fetching challenges:", error);
                res.status(500).send({ message: "Failed to fetch challenges" });
            }
        });

        // GET SINGLE CHALLENGE (Needed for Detail Page)
        app.get('/api/challenges/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const challenge = await challengesCollection.findOne(query);
            if (!challenge) {
                return res.status(404).send({ message: "Challenge not found" });
            }
            res.send(challenge);
        });

        // ------------------------------------
        // C. USERS API
        // ------------------------------------
        app.post('/api/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'User already exists', insertedId: null });
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });


        // ------------------------------------
        // D. OTHER APIs (TASKS, etc.) would go here
        // ------------------------------------


        // Send a final ping upon successful connection and setup
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Note: Client connection is usually kept alive for Express server
        // If you were not using Express, you would close the client here: await client.close();
    }
}

// Execute the main function
run().catch(console.dir);


// ===================================
// 6. Root Routes and Listener
// ===================================
app.get('/', (req, res) => {
    res.send('EcoTrack Server is running...');
});

app.listen(port, () => {
    console.log(`EcoTrack server is running on port: ${port}`);
});