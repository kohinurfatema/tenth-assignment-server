const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rufixhv.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const seedData = {
  featured: [
    {
      title: '30-Day Plastic Fast',
      summary: 'Commit to zero single-use plastic for 30 days and track your impact.',
      imageURL: 'https://picsum.photos/id/1015/1000/400',
      ctaSlug: '30-day-plastic-fast'
    },
    {
      title: 'Water Conservation Week',
      summary: 'Log daily water-saving actions and compare progress with friends.',
      imageURL: 'https://picsum.photos/id/1016/1000/400',
      ctaSlug: 'water-conservation-week'
    },
    {
      title: 'Transit Commuter Challenge',
      summary: 'Swap solo drives for biking, carpooling, or public transit for two weeks.',
      imageURL: 'https://picsum.photos/id/1011/1000/400',
      ctaSlug: 'transit-commuter-challenge'
    }
  ],
  stats: [
    { metric: 'Total CO₂ Saved', value: 154780, unit: 'kg', icon: '☁️' },
    { metric: 'Plastic Reduced', value: 9500, unit: 'kg', icon: '♻️' },
    { metric: 'Active Users', value: 12400, unit: '', icon: '👤' },
    { metric: 'Community Events', value: 250, unit: '+', icon: '🗓️' },
  ],
  challenges: [
    {
      title: 'Plastic-Free July',
      category: 'Waste Reduction',
      description: 'Avoid single-use plastic for one month and share weekly tips.',
      duration: 30,
      target: 'Reduce plastic waste',
      participants: 125,
      impactMetric: 'kg plastic saved',
      createdBy: 'admin@ecotrack.com',
      startDate: '2024-07-01',
      endDate: '2024-07-31',
      imageUrl: 'https://picsum.photos/id/10/400/300',
      slug: 'plastic-free-july',
      order: 1,
      metricDisplay: '125 users · 950kg plastic saved',
      createdAt: '2024-05-15T00:00:00Z',
      updatedAt: '2024-05-15T00:00:00Z'
    },
    {
      title: 'Local Produce Pledge',
      category: 'Green Living',
      description: 'Buy locally sourced produce for all meals over the next four weeks.',
      duration: 28,
      target: 'Cut food miles',
      participants: 88,
      impactMetric: 'miles reduced',
      createdBy: 'admin@ecotrack.com',
      startDate: '2024-08-10',
      endDate: '2024-09-07',
      imageUrl: 'https://picsum.photos/id/20/400/300',
      slug: 'local-produce-pledge',
      order: 2,
      metricDisplay: '88 users · 450 miles reduced',
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z'
    },
    {
      title: 'Water Conservation Week',
      category: 'Water Conservation',
      description: 'Log daily water-saving actions such as low-flow showers or reuse.',
      duration: 7,
      target: 'Save household water',
      participants: 150,
      impactMetric: 'liters saved',
      createdBy: 'admin@ecotrack.com',
      startDate: '2024-09-01',
      endDate: '2024-09-08',
      imageUrl: 'https://picsum.photos/id/30/400/300',
      slug: 'water-conservation-week',
      order: 3,
      metricDisplay: '150 users · 12,000L water saved',
      createdAt: '2024-07-10T00:00:00Z',
      updatedAt: '2024-07-10T00:00:00Z'
    },
    {
      title: 'Transit Commuter Challenge',
      category: 'Sustainable Transport',
      description: 'Swap solo drives for biking, carpooling, or public transit for two weeks.',
      duration: 14,
      target: 'Lower CO₂ emissions',
      participants: 55,
      impactMetric: 'kg CO₂ avoided',
      createdBy: 'admin@ecotrack.com',
      startDate: '2024-06-05',
      endDate: '2024-06-19',
      imageUrl: 'https://picsum.photos/id/40/400/300',
      slug: 'transit-commuter-challenge',
      order: 4,
      metricDisplay: '55 users · 5,500kg CO₂ avoided',
      createdAt: '2024-04-25T00:00:00Z',
      updatedAt: '2024-04-25T00:00:00Z'
    },
    {
      title: 'Neighborhood Tree Planting',
      category: 'Energy Conservation',
      description: 'Coordinate teams to plant shade trees across local neighborhoods.',
      duration: 10,
      target: 'Increase urban canopy',
      participants: 42,
      impactMetric: 'saplings planted',
      createdBy: 'admin@ecotrack.com',
      startDate: '2024-10-12',
      endDate: '2024-10-22',
      imageUrl: 'https://picsum.photos/id/50/400/300',
      slug: 'neighborhood-tree-planting',
      order: 5,
      metricDisplay: '42 teams · 320 saplings',
      createdAt: '2024-08-01T00:00:00Z',
      updatedAt: '2024-08-01T00:00:00Z'
    },
    {
      title: 'Compost Hero Sprint',
      category: 'Green Living',
      description: 'Divert food scraps and yard waste to compost for fourteen days.',
      duration: 14,
      target: 'Divert organic waste',
      participants: 63,
      impactMetric: 'tons diverted',
      createdBy: 'admin@ecotrack.com',
      startDate: '2024-05-01',
      endDate: '2024-05-15',
      imageUrl: 'https://picsum.photos/id/60/400/300',
      slug: 'compost-hero-sprint',
      order: 6,
      metricDisplay: '63 users · 1.2 tons diverted',
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    },
  ],
  tips: [
    {
      title: 'DIY Compost Bin in Under 30 Minutes',
      authorName: 'GardenGuru',
      upvotes: 45,
      createdAt: new Date('2025-11-08T10:00:00Z'),
      preview: 'Using old pallets and chicken wire, I constructed a simple and effective compost bin.'
    },
    {
      title: 'Switching to Bamboo Toothbrushes: Worth It?',
      authorName: 'ZeroWasteJane',
      upvotes: 22,
      createdAt: new Date('2025-11-07T15:30:00Z'),
      preview: "I tried five different brands of bamboo toothbrushes this month. Here's my honest review."
    },
    {
      title: 'The Simple Trick to Reducing Food Waste',
      authorName: 'ChefEco',
      upvotes: 78,
      createdAt: new Date('2025-11-06T08:45:00Z'),
      preview: "The secret is simple: a 'use first' basket in your fridge. It works wonders."
    },
    {
      title: 'My Solar Panel Installation Journey',
      authorName: 'SunnySideUp',
      upvotes: 120,
      createdAt: new Date('2025-11-05T19:15:00Z'),
      preview: 'A breakdown of the costs, permits, and process of installing solar panels last spring.'
    },
    {
      title: 'Batch Cooking for a Lower Carbon Footprint',
      authorName: 'MealPrepPro',
      upvotes: 61,
      createdAt: new Date('2025-11-04T12:00:00Z'),
      preview: 'Planning meals ahead not only saves money but dramatically reduces food waste.'
    },
  ],
  events: [
    {
      title: 'Community Beach Cleanup',
      date: new Date('2025-11-22T09:00:00Z'),
      location: 'Sunrise Coast Beach, Pier A',
      description: 'Spend a morning helping to clear our local coastline. Gloves and bags provided.'
    },
    {
      title: 'Urban Gardening Workshop',
      date: new Date('2025-11-30T14:30:00Z'),
      location: 'The Green Hub, Room 101',
      description: 'Learn how to maximize small spaces for growing herbs and vegetables in the city.'
    },
    {
      title: 'Bike-to-Work Advocacy Ride',
      date: new Date('2025-12-05T07:00:00Z'),
      location: 'City Hall Plaza',
      description: 'Join us for a peaceful ride to promote better cycling infrastructure downtown.'
    },
    {
      title: 'Zero Waste Holiday Market',
      date: new Date('2025-12-14T11:00:00Z'),
      location: 'Old Town Market Square',
      description: 'Shop local, sustainable, and handmade gifts for the holiday season.'
    },
  ],
};

const collections = {};

const ensureDb = () => {
  if (!collections.featuredChallenges) {
    throw new Error('Database not initialized yet');
  }
};

const seedCollection = async (collection, data) => {
  const count = await collection.estimatedDocumentCount();
  if (count === 0) {
    await collection.insertMany(data);
  }
};

const slugify = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const toObjectId = (value) => {
  if (!value || !ObjectId.isValid(value)) {
    return null;
  }
  return new ObjectId(value);
};

const normalizeChallenge = (challenge) => {
  if (!challenge) return null;
  const normalized = { ...challenge };
  if (normalized._id && typeof normalized._id !== 'string') {
    normalized._id = normalized._id.toString();
  }
  normalized.id = normalized._id;
  normalized.imageUrl = normalized.imageUrl || normalized.imageURL;
  normalized.imageURL = normalized.imageURL || normalized.imageUrl;
  normalized.metric = normalized.metricDisplay || normalized.metric;
  return normalized;
};

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

const joinChallengeForUser = async ({ userId, challengeId, status = 'Not Started', progress = 0, note = 'Joined challenge' }) => {
  if (!userId) {
    throw { status: 400, message: 'userId is required' };
  }

  let challengeObjectId = toObjectId(challengeId);
  let challengeRecord = null;
  if (challengeObjectId) {
    challengeRecord = await collections.challenges.findOne({ _id: challengeObjectId });
  } else if (typeof challengeId === 'string' && challengeId.trim().length) {
    challengeRecord = await collections.challenges.findOne({ slug: challengeId });
    if (challengeRecord) {
      challengeObjectId = challengeRecord._id;
    }
  }
  if (!challengeObjectId || !challengeRecord) {
    throw { status: 404, message: 'Challenge not found' };
  }

  const timestamp = new Date();
  const numericProgress = Number(progress);
  const doc = {
    userId,
    challengeId: challengeObjectId,
    status,
    progress: numericProgress,
    joinDate: timestamp,
    lastUpdated: timestamp,
    progressUpdates: [
      {
        progress: numericProgress,
        note,
        timestamp,
      },
    ],
  };

  try {
    const result = await collections.userChallenges.insertOne(doc);
    await collections.challenges.updateOne({ _id: challengeObjectId }, { $inc: { participants: 1 } });
    return { _id: result.insertedId, ...doc };
  } catch (error) {
    if (error.code === 11000) {
      throw { status: 409, message: 'User already joined this challenge' };
    }
    throw error;
  }
};

async function run() {
  await client.connect();
  const db = client.db('ecoTrackDB');
  collections.featuredChallenges = db.collection('featuredChallenges');
  collections.liveStats = db.collection('liveStats');
  collections.challenges = db.collection('challenges');
  collections.tips = db.collection('tips');
  collections.events = db.collection('events');
  collections.userChallenges = db.collection('userChallenges');

  await seedCollection(collections.featuredChallenges, seedData.featured);
  await seedCollection(collections.liveStats, seedData.stats);
  const challengeDocs = seedData.challenges.map((challenge) => {
    const createdAt = toDate(challenge.createdAt) || new Date();
    const updatedAt = toDate(challenge.updatedAt) || createdAt;
    return {
      ...challenge,
      imageURL: challenge.imageUrl,
      createdAt,
      updatedAt,
      startDate: toDate(challenge.startDate) || new Date(),
      endDate: toDate(challenge.endDate) || new Date(),
    };
  });
  await seedCollection(collections.challenges, challengeDocs);
  await seedCollection(collections.tips, seedData.tips);
  await seedCollection(collections.events, seedData.events);
  await collections.userChallenges.createIndex({ userId: 1, challengeId: 1 }, { unique: true });

  await client.db('admin').command({ ping: 1 });
  console.log('MongoDB connected and seed data ready.');
}

const dbReady = run().catch((err) => {
  console.error('Database connection failed:', err);
});

app.get('/api/featured-challenges', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const items = await collections.featuredChallenges.find({}).toArray();
    res.send(items);
  } catch (error) {
    console.error('Error fetching featured challenges:', error);
    res.status(500).send({ message: 'Unable to fetch featured challenges' });
  }
});

app.get('/api/stats/live', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const items = await collections.liveStats.find({}).toArray();
    res.send(items);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).send({ message: 'Unable to fetch statistics' });
  }
});

app.get('/api/challenges', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { category, q, startDateFrom, startDateTo, endDateFrom, endDateTo, participantsMin, participantsMax } = req.query;
    const query = {};
    if (category) {
      const categories = category.split(',').map((item) => item.trim()).filter(Boolean);
      if (categories.length) {
        query.category = { $in: categories };
      }
    }
    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }
    if (startDateFrom || startDateTo) {
      query.startDate = {};
      if (startDateFrom) {
        const parsed = toDate(startDateFrom);
        if (!parsed) {
          return res.status(400).send({ message: 'Invalid startDateFrom' });
        }
        query.startDate.$gte = parsed;
      }
      if (startDateTo) {
        const parsed = toDate(startDateTo);
        if (!parsed) {
          return res.status(400).send({ message: 'Invalid startDateTo' });
        }
        query.startDate.$lte = parsed;
      }
    }
    if (endDateFrom || endDateTo) {
      query.endDate = {};
      if (endDateFrom) {
        const parsed = toDate(endDateFrom);
        if (!parsed) {
          return res.status(400).send({ message: 'Invalid endDateFrom' });
        }
        query.endDate.$gte = parsed;
      }
      if (endDateTo) {
        const parsed = toDate(endDateTo);
        if (!parsed) {
          return res.status(400).send({ message: 'Invalid endDateTo' });
        }
        query.endDate.$lte = parsed;
      }
    }
    if (participantsMin || participantsMax) {
      query.participants = {};
      if (participantsMin) {
        const min = Number(participantsMin);
        if (!Number.isNaN(min)) {
          query.participants.$gte = min;
        }
      }
      if (participantsMax) {
        const max = Number(participantsMax);
        if (!Number.isNaN(max)) {
          query.participants.$lte = max;
        }
      }
      if (!Object.keys(query.participants).length) {
        delete query.participants;
      }
    }
    const items = await collections.challenges.find(query).sort({ order: 1, startDate: 1 }).toArray();
    const normalized = items.map(normalizeChallenge);
    res.send(normalized);
  } catch (error) {
    console.error('Error fetching challenges list:', error);
    res.status(500).send({ message: 'Unable to fetch challenges' });
  }
});

app.get('/api/challenges/active', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const items = await collections.challenges
      .find({})
      .sort({ order: 1 })
      .limit(6)
      .toArray();
    const normalized = items.map(normalizeChallenge);
    res.send(normalized);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).send({ message: 'Unable to fetch challenges' });
  }
});

app.get('/api/challenges/:id', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { id } = req.params;
    let query = { slug: id };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    }
    const challenge = await collections.challenges.findOne(query);
    if (!challenge) {
      return res.status(404).send({ message: 'Challenge not found' });
    }
    res.send(normalizeChallenge(challenge));
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).send({ message: 'Unable to fetch challenge' });
  }
});

app.post('/api/challenges', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const payload = req.body || {};
    const requiredFields = ['title', 'category', 'description', 'duration', 'target', 'impactMetric', 'createdBy', 'startDate', 'endDate', 'imageUrl'];
    const missing = requiredFields.filter((field) => !payload[field]);
    if (missing.length) {
      return res.status(400).send({ message: `Missing fields: ${missing.join(', ')}` });
    }
    const startDate = toDate(payload.startDate);
    const endDate = toDate(payload.endDate);
    if (!startDate || !endDate) {
      return res.status(400).send({ message: 'Invalid start or end date' });
    }
    const doc = {
      title: payload.title,
      category: payload.category,
      description: payload.description,
      duration: Number(payload.duration),
      target: payload.target,
      participants: Number(payload.participants ?? 0),
      impactMetric: payload.impactMetric,
      createdBy: payload.createdBy,
      startDate,
      endDate,
      imageUrl: payload.imageUrl,
      imageURL: payload.imageUrl,
      slug: payload.slug ? slugify(payload.slug) : slugify(payload.title),
      order: payload.order ?? 99,
      metricDisplay: payload.metricDisplay || `${payload.participants ?? 0} participants`,
    };
    const now = new Date();
    doc.createdAt = now;
    doc.updatedAt = now;
    const result = await collections.challenges.insertOne(doc);
    res.status(201).send(normalizeChallenge({ _id: result.insertedId, ...doc }));
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).send({ message: 'Unable to create challenge' });
  }
});

const updateChallengeHandler = async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { id } = req.params;
    const challengeId = toObjectId(id);
    if (!challengeId) {
      return res.status(400).send({ message: 'Invalid challenge id' });
    }
    const payload = req.body || {};
    const update = {
      ...payload,
      imageURL: payload.imageUrl ?? payload.imageURL,
    };
    if (update.imageUrl === undefined && update.imageURL) {
      update.imageUrl = update.imageURL;
    }
    if ('createdAt' in update) {
      delete update.createdAt;
    }
    if (update.startDate) {
      const parsed = toDate(update.startDate);
      if (!parsed) {
        return res.status(400).send({ message: 'Invalid start date' });
      }
      update.startDate = parsed;
    }
    if (update.endDate) {
      const parsed = toDate(update.endDate);
      if (!parsed) {
        return res.status(400).send({ message: 'Invalid end date' });
      }
      update.endDate = parsed;
    }
    ['duration', 'participants', 'order'].forEach((field) => {
      if (field in update) {
        update[field] = Number(update[field]);
      }
    });
    if (update.title && !update.slug) {
      update.slug = slugify(update.title);
    }
    update.updatedAt = new Date();
    const result = await collections.challenges.findOneAndUpdate(
      { _id: challengeId },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).send({ message: 'Challenge not found' });
    }
    res.send(normalizeChallenge(result.value));
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).send({ message: 'Unable to update challenge' });
  }
};

app.put('/api/challenges/:id', updateChallengeHandler);
app.patch('/api/challenges/:id', updateChallengeHandler);

app.delete('/api/challenges/:id', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { id } = req.params;
    const challengeId = toObjectId(id);
    if (!challengeId) {
      return res.status(400).send({ message: 'Invalid challenge id' });
    }
    const result = await collections.challenges.findOneAndDelete({ _id: challengeId });
    if (!result.value) {
      return res.status(404).send({ message: 'Challenge not found' });
    }
    await collections.userChallenges.deleteMany({ challengeId });
    res.send({ message: 'Challenge deleted' });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).send({ message: 'Unable to delete challenge' });
  }
});

app.post('/api/challenges/join/:id', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const payload = {
      ...req.body,
      challengeId: req.params.id,
    };
    const joined = await joinChallengeForUser(payload);
    res.status(201).send(joined);
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).send({ message: error.message });
    }
    console.error('Error joining challenge:', error);
    res.status(500).send({ message: 'Unable to join challenge' });
  }
});

app.post('/api/user-challenges', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const joined = await joinChallengeForUser(req.body || {});
    res.status(201).send(joined);
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).send({ message: error.message });
    }
    console.error('Error creating user challenge:', error);
    res.status(500).send({ message: 'Unable to join challenge' });
  }
});

app.get('/api/user-challenges', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { userId, includeDetails } = req.query;
    const query = userId ? { userId } : {};
    const shouldInclude = includeDetails === '1';
    if (shouldInclude) {
      const pipeline = [
        { $match: query },
        { $sort: { joinDate: -1 } },
        {
          $lookup: {
            from: 'challenges',
            localField: 'challengeId',
            foreignField: '_id',
            as: 'challenge',
          },
        },
        {
          $unwind: {
            path: '$challenge',
            preserveNullAndEmptyArrays: true,
          },
        },
      ];
      const items = await collections.userChallenges.aggregate(pipeline).toArray();
      const normalized = items.map((doc) => ({
        ...doc,
        challenge: normalizeChallenge(doc.challenge),
      }));
      res.send(normalized);
    } else {
      const items = await collections.userChallenges.find(query).sort({ joinDate: -1 }).toArray();
      res.send(items);
    }
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).send({ message: 'Unable to fetch user challenges' });
  }
});

app.get('/api/user-challenges/:id', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { id } = req.params;
    const recordId = toObjectId(id);
    if (!recordId) {
      return res.status(400).send({ message: 'Invalid user challenge id' });
    }
    const doc = await collections.userChallenges.findOne({ _id: recordId });
    if (!doc) {
      return res.status(404).send({ message: 'User challenge not found' });
    }
    res.send(doc);
  } catch (error) {
    console.error('Error fetching user challenge:', error);
    res.status(500).send({ message: 'Unable to fetch user challenge' });
  }
});

app.patch('/api/user-challenges/:id', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { id } = req.params;
    const recordId = toObjectId(id);
    if (!recordId) {
      return res.status(400).send({ message: 'Invalid user challenge id' });
    }
    const update = {};
    const updateDoc = {};
    if (req.body?.status) update.status = req.body.status;
    if (req.body?.progress !== undefined) {
      update.progress = Number(req.body.progress);
      update.lastUpdated = new Date();
      const entry = {
        progress: Number(req.body.progress),
        note: req.body.note || 'Progress updated',
        timestamp: new Date(),
      };
      updateDoc.$push = { progressUpdates: entry };
    }
    if (!Object.keys(update).length && !updateDoc.$push) {
      return res.status(400).send({ message: 'Nothing to update' });
    }
    updateDoc.$set = update;
    const result = await collections.userChallenges.findOneAndUpdate(
      { _id: recordId },
      updateDoc,
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).send({ message: 'User challenge not found' });
    }
    res.send(result.value);
  } catch (error) {
    console.error('Error updating user challenge:', error);
    res.status(500).send({ message: 'Unable to update user challenge' });
  }
});

app.get('/api/tips/recent', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const items = await collections.tips
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    res.send(items);
  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).send({ message: 'Unable to fetch tips' });
  }
});

app.get('/api/events/upcoming', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const items = await collections.events
      .find({})
      .sort({ date: 1 })
      .limit(4)
      .toArray();
    res.send(items);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send({ message: 'Unable to fetch events' });
  }
});

app.get('/', (req, res) => {
  res.send('EcoTrack Server is running...');
});

app.listen(port, () => {
  console.log(`EcoTrack server is running on port: ${port}`);
});
