const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const isDev = process.env.NODE_ENV !== 'production';
const log = (...args) => { if (isDev) log(...args); };

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:5173',
  'https://eco-track-app.web.app',
  'https://eco-track-app.firebaseapp.com',
  'https://eco-track-authentication.web.app',
  'https://eco-track-authentication.firebaseapp.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain and any explicitly listed origin
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rufixhv.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const seedData = {
  users: [
    {
      email: 'demo@ecotrack.com',
      displayName: 'Demo User',
      role: 'user',
      photoURL: 'https://i.pravatar.cc/150?u=demo@ecotrack.com',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      email: 'admin@ecotrack.com',
      displayName: 'Admin User',
      role: 'admin',
      photoURL: 'https://i.pravatar.cc/150?u=admin@ecotrack.com',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
},    {      email: 'manager@ecotrack.com',      displayName: 'Manager User',      role: 'manager',      photoURL: 'https://i.pravatar.cc/150?u=manager@ecotrack.com',      createdAt: new Date('2024-01-01T00:00:00Z'),      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
  ],
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
  blogs: [
    {
      title: '10 Simple Ways to Reduce Your Carbon Footprint Today',
      excerpt: 'Small everyday changes can lead to massive environmental impact. From switching to LED bulbs to choosing plant-based meals twice a week, discover practical actions you can start right now.',
      category: 'Lifestyle',
      author: 'Sarah Johnson',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
      slug: 'reduce-carbon-footprint',
      date: new Date('2025-11-10'),
      createdAt: new Date('2025-11-10'),
    },
    {
      title: 'The Complete Guide to Zero-Waste Grocery Shopping',
      excerpt: 'Learn how to shop smarter, bring the right containers, find bulk stores near you, and cut your household plastic waste by up to 90% with these proven strategies.',
      category: 'Tips & Tricks',
      author: 'Michael Chen',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600',
      slug: 'zero-waste-grocery-shopping',
      date: new Date('2025-11-08'),
      createdAt: new Date('2025-11-08'),
    },
    {
      title: 'How Our Community Saved 15,000 kg of CO2 This Month',
      excerpt: 'EcoTrack members across 42 active challenges hit an incredible milestone. We break down which challenges had the biggest impact and what it means for the planet.',
      category: 'Community',
      author: 'Emma Wilson',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
      slug: 'community-co2-milestone',
      date: new Date('2025-11-05'),
      createdAt: new Date('2025-11-05'),
    },
    {
      title: 'Why Composting at Home Is Easier Than You Think',
      excerpt: 'Fear of smell, pests, and complexity stops most people. We bust the myths and walk you through a foolproof setup that takes less than 15 minutes.',
      category: 'Tips & Tricks',
      author: 'David Park',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1588964895597-cfbcd9f8e849?w=600',
      slug: 'home-composting-guide',
      date: new Date('2025-11-03'),
      createdAt: new Date('2025-11-03'),
    },
    {
      title: 'New Research: Urban Green Spaces Cut City Temperatures by 4°C',
      excerpt: 'A landmark study across 12 cities confirms that tree canopy and green rooftops are among the most cost-effective strategies for battling the urban heat island effect.',
      category: 'Science',
      author: 'Dr. Anika Rao',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600',
      slug: 'urban-green-spaces-research',
      date: new Date('2025-10-30'),
      createdAt: new Date('2025-10-30'),
    },
    {
      title: 'Sustainable Travel: How to Explore the World Responsibly',
      excerpt: 'Travel does not have to mean a large carbon footprint. From choosing trains over planes to supporting local economies, this guide covers the conscious explorer.',
      category: 'Lifestyle',
      author: 'Lucia Fernandez',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
      slug: 'sustainable-travel-guide',
      date: new Date('2025-10-27'),
      createdAt: new Date('2025-10-27'),
    },
    {
      title: 'The Rise of Community Solar: Is It Right for Your Neighborhood?',
      excerpt: 'You do not need rooftop panels to go solar. Community solar programs let renters and homeowners subscribe to a share of a local solar farm and cut electricity bills.',
      category: 'News',
      author: 'James Okonkwo',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600',
      slug: 'community-solar-programs',
      date: new Date('2025-10-24'),
      createdAt: new Date('2025-10-24'),
    },
    {
      title: "Plant-Based Eating: A Beginner's 30-Day Starter Plan",
      excerpt: 'Going plant-based does not mean giving up delicious food. Our 30-day plan eases you in with familiar favourites reimagined, plus a complete shopping list for every week.',
      category: 'Lifestyle',
      author: 'Priya Sharma',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
      slug: 'plant-based-30-day-plan',
      date: new Date('2025-10-20'),
      createdAt: new Date('2025-10-20'),
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
  collections.users = db.collection('users');
  collections.contacts = db.collection('contacts');
  collections.blogs = db.collection('blogs');

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
  await seedCollection(collections.users, seedData.users);
  await seedCollection(collections.blogs, seedData.blogs);
  await collections.users.createIndex({ email: 1 }, { unique: true });
  await collections.userChallenges.createIndex({ userId: 1, challengeId: 1 }, { unique: true });
  await collections.blogs.createIndex({ slug: 1 }, { unique: true });

  await client.db('admin').command({ ping: 1 });
  console.log('MongoDB connected and seed data ready.');
}

const dbReady = run().catch((err) => {
  if (process.env.NODE_ENV !== 'production') log('Database connection failed:', err);
});

// ─── Role-based middleware ────────────────────────────────────────────────────

/**
 * Checks the x-user-role header sent by the client.
 * Admin routes are protected so only admin/manager roles can access them.
 */
const requireAdminOrManager = (req, res, next) => {
  const role = req.headers['x-user-role'] || '';
  const email = req.headers['x-user-email'] || '';
  const isAdmin = role === 'admin' || email.includes('admin');
  const isManager = role === 'manager' || email.includes('manager');
  if (!isAdmin && !isManager) {
    return res.status(403).send({ message: 'Forbidden: Admin or Manager access required' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'] || '';
  const email = req.headers['x-user-email'] || '';
  const isAdmin = role === 'admin' || email.includes('admin');
  if (!isAdmin) {
    return res.status(403).send({ message: 'Forbidden: Admin access required' });
  }
  next();
};

app.get('/api/featured-challenges', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const items = await collections.featuredChallenges.find({}).toArray();
    res.send(items);
  } catch (error) {
    log('Error fetching featured challenges:', error);
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
    log('Error fetching stats:', error);
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
    log('Error fetching challenges list:', error);
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
    log('Error fetching challenges:', error);
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
    log('Error fetching challenge:', error);
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
    log('Error creating challenge:', error);
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
    log('Error updating challenge:', error);
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
    log('Error deleting challenge:', error);
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
    log('Error joining challenge:', error);
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
    log('Error creating user challenge:', error);
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
    log('Error fetching user challenges:', error);
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
    log('Error fetching user challenge:', error);
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
    log('Error updating user challenge:', error);
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
    log('Error fetching tips:', error);
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
    log('Error fetching events:', error);
    res.status(500).send({ message: 'Unable to fetch events' });
  }
});

app.get('/', (req, res) => {
  res.send('EcoTrack Server is running...');
});
app.get('/api/users', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const items = await collections.users.find({}).toArray();
    // Remove sensitive fields
    const sanitized = items.map(({ password, ...user }) => user);
    res.send(sanitized);
  } catch (error) {
    log('Error fetching users:', error);
    res.status(500).send({ message: 'Unable to fetch users' });
  }
});

app.get('/api/users/:email', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { email } = req.params;
    const user = await collections.users.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const { password, ...sanitized } = user;
    res.send(sanitized);
  } catch (error) {
    log('Error fetching user:', error);
    res.status(500).send({ message: 'Unable to fetch user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { email, displayName, role = 'user', photoURL } = req.body || {};
    if (!email) {
      return res.status(400).send({ message: 'Email is required' });
    }
    const existing = await collections.users.findOne({ email });
    if (existing) {
      // Update existing user
      const update = { updatedAt: new Date() };
      if (displayName) update.displayName = displayName;
      if (photoURL) update.photoURL = photoURL;
      await collections.users.updateOne({ email }, { $set: update });
      const updated = await collections.users.findOne({ email });
      return res.send(updated);
    }
    const doc = {
      email,
      displayName: displayName || email.split('@')[0],
      role,
      photoURL: photoURL || `https://i.pravatar.cc/150?u=${email}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collections.users.insertOne(doc);
    res.status(201).send({ _id: result.insertedId, ...doc });
  } catch (error) {
    log('Error creating user:', error);
    res.status(500).send({ message: 'Unable to create user' });
  }
});

app.patch('/api/users/:email', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { email } = req.params;
    const update = { ...req.body, updatedAt: new Date() };
    delete update.email; // Don't allow email change
    delete update.createdAt;
    const result = await collections.users.findOneAndUpdate(
      { email },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(result.value);
  } catch (error) {
    log('Error updating user:', error);
    res.status(500).send({ message: 'Unable to update user' });
  }
});

// ─── Blogs ────────────────────────────────────────────────────────────────────

app.get('/api/blogs', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { limit, category, q } = req.query;
    const query = {};
    if (category) query.category = category;
    if (q) query.title = { $regex: q, $options: 'i' };
    let cursor = collections.blogs.find(query).sort({ createdAt: -1 });
    if (limit) cursor = cursor.limit(Number(limit));
    const items = await cursor.toArray();
    res.send(items);
  } catch (error) {
    log('Error fetching blogs:', error);
    res.status(500).send({ message: 'Unable to fetch blogs' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { slug } = req.params;
    const blog = await collections.blogs.findOne({ slug });
    if (!blog) return res.status(404).send({ message: 'Blog post not found' });
    res.send(blog);
  } catch (error) {
    log('Error fetching blog:', error);
    res.status(500).send({ message: 'Unable to fetch blog post' });
  }
});

// ─── Contacts ─────────────────────────────────────────────────────────────────

app.post('/api/contacts', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).send({ message: 'name, email, and message are required' });
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send({ message: 'Invalid email address' });
    }
    const doc = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject || 'General Inquiry',
      message: message.trim(),
      status: 'unread',
      createdAt: new Date(),
    };
    const result = await collections.contacts.insertOne(doc);
    res.status(201).send({ _id: result.insertedId, ...doc });
  } catch (error) {
    log('Error saving contact:', error);
    res.status(500).send({ message: 'Unable to save contact message' });
  }
});

app.get('/api/contacts', requireAdminOrManager, async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const items = await collections.contacts.find({}).sort({ createdAt: -1 }).toArray();
    res.send(items);
  } catch (error) {
    log('Error fetching contacts:', error);
    res.status(500).send({ message: 'Unable to fetch contacts' });
  }
});

// ─── Aggregated Stats ─────────────────────────────────────────────────────────

app.get('/api/stats', requireAdminOrManager, async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const [users, challenges] = await Promise.all([
      collections.users.find({}).toArray(),
      collections.challenges.find({}).toArray(),
    ]);
    const now = new Date();
    const totalParticipants = challenges.reduce((s, c) => s + (c.participants || 0), 0);
    const activeChallenges = challenges.filter(c => c.endDate && new Date(c.endDate) > now);
    const expiredChallenges = challenges.filter(c => c.endDate && new Date(c.endDate) <= now);
    const completionRate = challenges.length
      ? Math.round((expiredChallenges.length / challenges.length) * 100) + '%'
      : '0%';

    res.send({
      totalUsers: users.length,
      totalChallenges: challenges.length,
      activeParticipants: totalParticipants,
      activeChallenges: activeChallenges.length,
      co2Saved: (totalParticipants * 12).toLocaleString() + ' kg',
      weeklyGrowth: '+' + activeChallenges.length + ' active',
      completionRate,
    });
  } catch (error) {
    log('Error fetching stats:', error);
    res.status(500).send({ message: 'Unable to fetch stats' });
  }
});

// ─── Activities (user challenge feed) ────────────────────────────────────────

app.get('/api/activities', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { user } = req.query;
    if (!user) return res.status(400).send({ message: 'user query param is required' });

    const pipeline = [
      { $match: { userId: user } },
      { $sort: { joinDate: -1 } },
      {
        $lookup: {
          from: 'challenges',
          localField: 'challengeId',
          foreignField: '_id',
          as: 'challengeData',
        },
      },
      { $unwind: { path: '$challengeData', preserveNullAndEmptyArrays: true } },
    ];

    const items = await collections.userChallenges.aggregate(pipeline).toArray();
    const normalized = items.map(doc => ({
      _id: doc._id,
      userId: doc.userId,
      status: doc.status || 'Not Started',
      progress: doc.progress || 0,
      joinedAt: doc.joinDate,
      lastUpdated: doc.lastUpdated,
      challengeTitle: doc.challengeData?.title || 'Unknown Challenge',
      challengeId: doc.challengeId,
      points: doc.challengeData?.points || 0,
      co2Saved: doc.challengeData?.co2Saved || 0,
      category: doc.challengeData?.category || '',
    }));

    res.send(normalized);
  } catch (error) {
    log('Error fetching activities:', error);
    res.status(500).send({ message: 'Unable to fetch activities' });
  }
});

// ─── Chart data endpoints ─────────────────────────────────────────────────────

// Weekly activity: joins per day for the last 7 days
// ?user=email  →  filter to that user; omit for platform-wide
app.get('/api/stats/weekly', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { user } = req.query;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const match = { joinDate: { $gte: sevenDaysAgo } };
    if (user) match.userId = user;

    const raw = await collections.userChallenges.aggregate([
      { $match: match },
      { $group: { _id: { $dayOfWeek: '$joinDate' }, tasks: { $sum: 1 } } },
    ]).toArray();

    // $dayOfWeek: 1=Sun … 7=Sat
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = {};
    raw.forEach(d => { map[d._id] = d.tasks; });

    // Build last 7 days in order starting from today
    const today = new Date().getDay(); // 0=Sun
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const dow = ((today - i) + 7) % 7; // 0-indexed
      const mongoKey = dow + 1;           // MongoDB uses 1-indexed
      const tasks = map[mongoKey] || 0;
      result.push({ name: dayNames[dow], tasks, points: tasks * 10 });
    }
    res.send(result);
  } catch (error) {
    log('Error fetching weekly stats:', error);
    res.status(500).send({ message: 'Unable to fetch weekly stats' });
  }
});

// Impact breakdown: challenge count grouped by category (joined challenges)
// ?user=email  →  filter to that user; omit for platform-wide
app.get('/api/stats/impact', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { user } = req.query;
    const match = user ? { userId: user } : {};

    const categoryColors = {
      'Waste Reduction':      '#22c55e',
      'Water Conservation':   '#3b82f6',
      'Green Living':         '#f59e0b',
      'Energy Conservation':  '#8b5cf6',
      'Sustainable Transport':'#ef4444',
    };

    const raw = await collections.userChallenges.aggregate([
      { $match: match },
      { $lookup: { from: 'challenges', localField: 'challengeId', foreignField: '_id', as: 'ch' } },
      { $unwind: { path: '$ch', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$ch.category', value: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
      { $sort: { value: -1 } },
    ]).toArray();

    const result = raw.map(d => ({
      name: d._id,
      value: d.value,
      color: categoryColors[d._id] || '#94a3b8',
    }));

    // Fallback when no data yet
    if (!result.length) {
      return res.send([
        { name: 'Waste Reduction',      value: 0, color: '#22c55e' },
        { name: 'Water Conservation',   value: 0, color: '#3b82f6' },
        { name: 'Green Living',         value: 0, color: '#f59e0b' },
        { name: 'Energy Conservation',  value: 0, color: '#8b5cf6' },
        { name: 'Sustainable Transport',value: 0, color: '#ef4444' },
      ]);
    }
    res.send(result);
  } catch (error) {
    log('Error fetching impact stats:', error);
    res.status(500).send({ message: 'Unable to fetch impact stats' });
  }
});

// Monthly platform growth: user sign-ups and challenge creations per month (last 6 months)
app.get('/api/stats/growth', async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [usersByMonth, challengesByMonth] = await Promise.all([
      collections.users.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]).toArray(),
      collections.challenges.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]).toArray(),
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yr = d.getFullYear(), mo = d.getMonth() + 1;
      const uEntry = usersByMonth.find(e => e._id.year === yr && e._id.month === mo);
      const cEntry = challengesByMonth.find(e => e._id.year === yr && e._id.month === mo);
      result.push({
        month: monthNames[mo - 1],
        users: uEntry ? uEntry.count : 0,
        challenges: cEntry ? cEntry.count : 0,
      });
    }
    res.send(result);
  } catch (error) {
    log('Error fetching growth stats:', error);
    res.status(500).send({ message: 'Unable to fetch growth stats' });
  }
});

// ─── Delete user by ObjectId ──────────────────────────────────────────────────

app.delete('/api/users/:id', requireAdmin, async (req, res) => {
  try {
    await dbReady;
    ensureDb();
    const { id } = req.params;
    const userId = toObjectId(id);
    if (!userId) return res.status(400).send({ message: 'Invalid user id' });
    const result = await collections.users.findOneAndDelete({ _id: userId });
    if (!result.value) return res.status(404).send({ message: 'User not found' });
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    log('Error deleting user:', error);
    res.status(500).send({ message: 'Unable to delete user' });
  }
});

app.listen(port, () => {
  console.log(`EcoTrack server is running on port: ${port}`);
});
