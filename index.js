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



// Middleware to verify custom JWT Token (for internal authorization flow)
const verifyJWTToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ message: 'unauthorized access: no header' })
    }
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access: no token' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden access: invalid token' })
        }
        req.user_email = decoded.email; 
        next();
    })
}



// ------------------------------------
//         MONGODB CONNECTION
// ------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vyznij5.mongodb.net/ecoTrackDB?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('EcoTrack Server is running')
})



async function run() {
    try {
        await client.connect();

        const db = client.db('ecoTrackDB'); 
        
        // 🚨 Collection Definitions (Matching your schema requirements)
        const challengesCollection = db.collection('challenges');
        const userChallengesCollection = db.collection('userChallenges');
        const usersCollection = db.collection('users');
        const tipsCollection = db.collection('tips'); // Defined but not yet used in APIs
        const eventsCollection = db.collection('events'); // Defined but not yet used in APIs


         // ------------------------------------
        //           JWT API
        // ------------------------------------
        app.post('/getToken', async (req, res) => {
            const loggedUser = req.body; 
            if (!loggedUser.email) {
                return res.status(400).send({ message: 'Email required for token creation' });
            }
            const token = jwt.sign(loggedUser, process.env.JWT_SECRET, { expiresIn: '1h' })
            res.send({ token: token })
        })

        // ------------------------------------
        //            USERS APIs (Saves user to MongoDB after Firebase auth)
        // ------------------------------------
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = newUser.email;
            
            if (!email) {
                 return res.status(400).send({ message: 'Email is required.' });
            }

            const query = { email: email }
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                res.send({ message: 'user already exists.' })
            }
            else {
                const result = await usersCollection.insertOne({ 
                    ...newUser, 
                    role: 'user', 
                    createdAt: new Date()
                });
                res.send(result);
            }
        })


        // ------------------------------------
        //           CHALLENGES APIs (Full CRUD + Join)
        // ------------------------------------

        // GET /api/challenges — list (supports filters, but implemented as simple list for now)
        app.get('/api/challenges', async (req, res) => {
            try {
                // Future: Implement filters based on req.query (e.g., category)
                const cursor = challengesCollection.find({}); 
                const result = await cursor.toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: 'Failed to fetch challenges', error: error.message });
            }
        });


        // GET /api/challenges/:id — details
        app.get('/api/challenges/:id', async (req, res) => {
            try {
                const id = req.params.id;
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ message: 'Invalid Challenge ID format.' });
                }
                const query = { _id: new ObjectId(id) };
                const result = await challengesCollection.findOne(query);
                
                if (!result) {
                    return res.status(404).send({ message: 'Challenge not found.' });
                }

                res.send(result);
            } catch (error) {
                res.status(500).send({ message: 'Failed to fetch challenge.', error: error.message });
            }
        });


        // POST /api/challenges — create (Protected by Firebase Token)
        app.post('/api/challenges', logger, verifyFireBaseToken, async (req, res) => {
            try {
                const newChallenge = { 
                    ...req.body, 
                    createdBy: req.user_email, // Set creator
                    participants: 0, // Initialize participant count
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                
                if (!newChallenge.title || !newChallenge.description || !newChallenge.category) {
                     return res.status(400).send({ message: 'Missing required challenge fields.' });
                }

                const result = await challengesCollection.insertOne(newChallenge);
                res.status(201).send(result);
            } catch (error) {
                res.status(500).send({ message: 'Failed to create challenge.', error: error.message });
            }
        });



        // PATCH /api/challenges/:id — update (Protected by Firebase Token)
        app.patch('/api/challenges/:id', logger, verifyFireBaseToken, async (req, res) => {
            try {
                const id = req.params.id;
                const updatedFields = req.body;
                
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ message: 'Invalid Challenge ID format.' });
                }

                // 🚨 Authorization Check (Placeholder for production role check)
                const existingChallenge = await challengesCollection.findOne({ _id: new ObjectId(id) });
                if (!existingChallenge) {
                    return res.status(404).send({ message: 'Challenge not found.' });
                }
                
                // if (existingChallenge.createdBy !== req.user_email) {
                //     return res.status(403).send({ message: 'forbidden access: not the challenge owner.' });
                // }

                const query = { _id: new ObjectId(id) };
                const updateDoc = {
                    $set: {
                        ...updatedFields,
                        updatedAt: new Date()
                    }
                };



                const result = await challengesCollection.updateOne(query, updateDoc);
                
                if (result.matchedCount === 0) {
                    return res.status(404).send({ message: 'Challenge not found or nothing changed.' });
                }

                res.send(result);
            } catch (error) {
                res.status(500).send({ message: 'Failed to update challenge.', error: error.message });
            }
        });

        // DELETE /api/challenges/:id — delete (Protected by Firebase Token)
        app.delete('/api/challenges/:id', logger, verifyFireBaseToken, async (req, res) => {
            try {
                const id = req.params.id;
                
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ message: 'Invalid Challenge ID format.' });
                }

                // 🚨 Authorization Check (Placeholder for production role check)
                
                const query = { _id: new ObjectId(id) };
                const result = await challengesCollection.deleteOne(query);

                if (result.deletedCount === 0) {
                    return res.status(404).send({ message: 'Challenge not found.' });
                }

                res.send(result);
            } catch (error) {
                res.status(500).send({ message: 'Failed to delete challenge.', error: error.message });
            }
        });



          // POST /api/challenges/join/:id — join challenge (Protected)
        app.post('/api/challenges/join/:id', logger, verifyFireBaseToken, async (req, res) => {
            try {
                const challengeId = req.params.id;
                const userId = req.user_uid; // Use the UID for user reference
                const userEmail = req.user_email;

                if (!ObjectId.isValid(challengeId)) {
                    return res.status(400).send({ message: 'Invalid Challenge ID format.' });
                }

                const challengeObjectId = new ObjectId(challengeId);

                // 1. Check if user has already joined
                const existingJoin = await userChallengesCollection.findOne({ 
                    userId: userId, 
                    challengeId: challengeObjectId 
                });

                if (existingJoin) {
                    return res.status(409).send({ message: 'User has already joined this challenge.' });
                }

                // 2. Insert new UserChallenge record
                const newUserChallenge = {
                    userId: userId, 
                    userEmail: userEmail,
                    challengeId: challengeObjectId,
                    status: 'Ongoing', 
                    progress: 0,
                    joinDate: new Date(),
                };
                const joinResult = await userChallengesCollection.insertOne(newUserChallenge);

                // 3. Increment participant count in the Challenges collection
                await challengesCollection.updateOne(
                    { _id: challengeObjectId },
                    { $inc: { participants: 1 } }
                );
                
                res.status(201).send({ 
                    message: 'Successfully joined challenge!', 
                    data: joinResult
                });

            } catch (error) {
                res.status(500).send({ message: 'Failed to join challenge.', error: error.message });
            }
        });



        // ------------------------------------
        //          ACTIVITIES APIs (UserChallenges Retrieval)
        // ------------------------------------

        // GET user's activities (Protected by JWT and email match)
        app.get('/api/activities', logger, verifyJWTToken, async (req, res) => {
            const email = req.query.email;
            const query = {};
            
            if (email) {
                query.userEmail = email; // Query activities based on email
            }

            if (email !== req.user_email) {
                return res.status(403).send({ message: 'forbidden access: email mismatch' });
            }
            
            try {
                // Fetch UserChallenges (activities) and then use $lookup for the challenge details
                const activities = await userChallengesCollection.aggregate([
                    { $match: query },
                    {
                        $lookup: {
                            from: "challenges",
                            localField: "challengeId",
                            foreignField: "_id",
                            as: "challengeDetails"
                        }
                    },
                    { $unwind: "$challengeDetails" } // Flatten the challengeDetails array
                ]).toArray();

                res.send(activities);
            } catch (error) {
                res.status(500).send({ message: 'Failed to fetch activities.', error: error.message });
            }
        });


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // ...
    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`EcoTrack server is running on port: ${port}`)
})