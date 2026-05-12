import express from "express";
import dotenv from "dotenv";
import pool from "./config/db.js";
import { mainAuthRouter } from "./routes/main/mainauthrouter.js";
import passport from "./config/passport.js";
import session from "express-session";
import pgSession from "connect-pg-simple";
import cors from "cors";
import mainTaskRouter from "./routes/main/maintaskrouter.js";
import  redisClient from "./config/redis.js";



// import crypto from "crypto";
// const sessionSecret = crypto.randomBytes(32).toString('hex');
// console.log(sessionSecret)

dotenv.config();
const app = express();
const PostgresStore = pgSession(session)

const allowedOrigins = [
  'https://pneuma-frontend-oijl.onrender.com', 
  'http://localhost:5173',                     
  process.env.FRONTEND_URL                      
];

// Define once
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked this origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Use everywhere
app.use(cors(corsOptions));
app.options('/*splat', cors(corsOptions)); // ✅ same config, not bare cors();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.enable('trust proxy'); // Add this line!


app.use(
  session({
    store: new PostgresStore({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 5,
    },
    proxy: true
  })
)

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;



app.use("/auth", mainAuthRouter);
app.use("/task", mainTaskRouter);
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    error: err.message || "something went wrong",
  });
});

const startServer = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to Supabase PostgreSQL");

    await redisClient.connect();
    console.log(" 🚀 Connected to Redis")

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect:", err.message);
    process.exit(1);
  }
};

startServer();
