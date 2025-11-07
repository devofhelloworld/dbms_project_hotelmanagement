require('dotenv').config(); 

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const homerouter = require('./routes/homerouter');
const adminrouter = require('./routes/adminrouter');
const managehotel = require('./models/managehotel');
const db = require('./utils/databaseutil'); 


const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT === 'production';


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// When deployed behind Railway (or other proxies), trust proxy for secure cookies
if (IS_PROD) {
  app.set('trust proxy', 1);
}


app.use(session({
  secret: process.env.SESSION_SECRET || 'Royal rajputs',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: IS_PROD,                         // only send cookie over HTTPS in prod
    sameSite: IS_PROD ? 'none' : 'lax',     // 'none' for cross-site cookies (when behind proxy + HTTPS)
    // you can add maxAge, httpOnly etc here
  }
}));


app.use((req, res, next) => {
  const notres = ['/', '/login', '/signup', '/adminlogin', '/adminlogout', '/admin', '/health'];
  if (notres.includes(req.path)) return next();

  if (req.session.isloggedin) return next();

  return res.redirect('/login');
});

app.use((req, res, next) => {
  if (req.url === '/adminlogin') return next();

  if (req.url.includes('/admin')) {
    if (req.session.isadminloggedin) return next();
    return res.redirect('/adminlogin');
  }
  return next();
});

app.get('/health', async (req, res) => {
  try {
    // use a simple DB check via your managehotel model (or db.query directly)
    await managehotel.gethotelinfo(); // if this throws, we'll catch below
    return res.status(200).json({ status: 'ok', db: true });
  } catch (err) {
    console.error('Healthcheck DB error:', err.message || err);
    return res.status(500).json({ status: 'error', db: false, error: err.message || err });
  }
});

// --- Attach routers ---
app.use(homerouter);
app.use(adminrouter);

// --- 404 handler (keeps your original behavior but uses async/await) ---
app.use(async (req, res, next) => {
  try {
    const [[data]] = await managehotel.gethotelinfo(); // keep your original shape
    const hoteldata = data;
    res.status(404).render('404', {
      isloggedin: req.session.isloggedin,
      useremail: req.session.useremail,
      hoteldata: hoteldata
    });
  } catch (err) {
    console.error('404 handler error:', err);
    // fallback 404 if DB fails
    res.status(404).render('404', {
      isloggedin: req.session.isloggedin,
      useremail: req.session.useremail,
      hoteldata: null
    });
  }
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).render('500', { error: IS_PROD ? null : err });
});

// --- Start server ---
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} (${NODE_ENV})`);
});

// --- Graceful shutdown (closes MySQL pool) ---
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    try {
      if (db && db.end) {
        // db is pool.promise(), calling end() closes pool
        await db.end();
        console.log('MySQL pool closed.');
      }
      console.log('Shutdown complete.');
      process.exit(0);
    } catch (e) {
      console.error('Error during shutdown:', e);
      process.exit(1);
    }
  });

  // If still not closed after 10s, force exit
  setTimeout(() => {
    console.warn('Forcing shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
