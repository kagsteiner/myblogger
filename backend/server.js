require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const xss = require('xss');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;

// Trust the nginx reverse proxy (required for rate limiting to work correctly)
app.set('trust proxy', 1);
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// ============================================
// Database Setup
// ============================================
const db = new Database(path.join(__dirname, 'comments.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    commentId INTEGER PRIMARY KEY AUTOINCREMENT,
    blogEntryId TEXT NOT NULL,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    released INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now'))
  )
`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_blog_entry ON comments(blogEntryId)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_released ON comments(released)`);

// ============================================
// Middleware
// ============================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));

// CORS - allow only neocities.org domains
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    // In production, you might want to be stricter
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow *.neocities.org and localhost for development
    const allowedPatterns = [
      /^https?:\/\/.*\.neocities\.org$/,
      /^https?:\/\/localhost(:\d+)?$/,
      /^https?:\/\/127\.0\.0\.1(:\d+)?$/
    ];
    
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files (admin page)
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// Rate Limiting
// ============================================

// General rate limit for all endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

// Strict rate limit for adding comments: 1 per minute
const commentLimiterPerMinute = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
  message: { error: 'You can only add one comment per minute. Please wait.' },
  keyGenerator: (req) => req.ip
});

// Strict rate limit for adding comments: 10 per hour
const commentLimiterPerHour = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'You have reached the maximum of 10 comments per hour. Please try again later.' },
  keyGenerator: (req) => req.ip
});

app.use(generalLimiter);

// ============================================
// Input Sanitization Helper
// ============================================
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  // Use xss library to prevent XSS attacks
  return xss(input.trim());
}

// ============================================
// Authentication Middleware
// ============================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ============================================
// API Endpoints
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Login endpoint for moderator
app.post('/api/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!ADMIN_PASSWORD_HASH) {
    return res.status(500).json({ error: 'Server not configured properly' });
  }

  const isValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Generate JWT token (valid for 24 hours)
  const token = jwt.sign({ role: 'moderator' }, JWT_SECRET, { expiresIn: '24h' });
  
  res.json({ token });
});

// Add a comment (public, rate limited)
app.post('/api/comments', commentLimiterPerMinute, commentLimiterPerHour, (req, res) => {
  const { blogEntryId, name, text } = req.body;

  // Validate required fields
  if (!blogEntryId || !name || !text) {
    return res.status(400).json({ error: 'Missing required fields: blogEntryId, name, text' });
  }

  // Sanitize inputs
  const sanitizedBlogEntryId = sanitizeInput(blogEntryId);
  const sanitizedName = sanitizeInput(name);
  const sanitizedText = sanitizeInput(text);

  // Validate lengths
  if (sanitizedName.length === 0 || sanitizedName.length > 100) {
    return res.status(400).json({ error: 'Name must be between 1 and 100 characters' });
  }

  if (sanitizedText.length === 0 || sanitizedText.length > 5000) {
    return res.status(400).json({ error: 'Comment must be between 1 and 5000 characters' });
  }

  if (sanitizedBlogEntryId.length === 0 || sanitizedBlogEntryId.length > 100) {
    return res.status(400).json({ error: 'Invalid blog entry ID' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO comments (blogEntryId, name, text, released)
      VALUES (?, ?, ?, 0)
    `);
    
    const result = stmt.run(sanitizedBlogEntryId, sanitizedName, sanitizedText);
    
    res.status(201).json({ 
      success: true, 
      message: 'Comment submitted for moderation',
      commentId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments (public for released, authenticated for unreleased)
app.get('/api/comments', (req, res) => {
  const { blogEntryId, role } = req.query;

  if (!blogEntryId) {
    return res.status(400).json({ error: 'blogEntryId is required' });
  }

  const sanitizedBlogEntryId = sanitizeInput(blogEntryId);

  try {
    let stmt;
    let comments;

    if (role === 'moderator') {
      // For moderator, verify authentication
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Authentication required for moderator view' });
      }

      try {
        jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Return unreleased comments for moderator
      stmt = db.prepare(`
        SELECT commentId, blogEntryId, name, text, createdAt
        FROM comments
        WHERE released = 0
        ORDER BY createdAt DESC
      `);
      comments = stmt.all();
    } else {
      // Return released comments for viewers
      stmt = db.prepare(`
        SELECT commentId, name, text, createdAt
        FROM comments
        WHERE blogEntryId = ? AND released = 1
        ORDER BY commentId ASC
      `);
      comments = stmt.all(sanitizedBlogEntryId);
    }

    res.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Delete a comment (authenticated)
app.delete('/api/comments/:commentId', authenticateToken, (req, res) => {
  const { commentId } = req.params;

  if (!commentId || isNaN(parseInt(commentId))) {
    return res.status(400).json({ error: 'Valid commentId is required' });
  }

  try {
    const stmt = db.prepare('DELETE FROM comments WHERE commentId = ?');
    const result = stmt.run(parseInt(commentId));

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Release all pending comments (authenticated, global)
app.post('/api/comments/release', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('UPDATE comments SET released = 1 WHERE released = 0');
    const result = stmt.run();

    res.json({ 
      success: true, 
      message: `Released ${result.changes} comment(s)`,
      releasedCount: result.changes
    });
  } catch (error) {
    console.error('Error releasing comments:', error);
    res.status(500).json({ error: 'Failed to release comments' });
  }
});

// ============================================
// Serve Admin Page
// ============================================
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// Start Server
// ============================================
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Comment system server running on http://${HOST}:${PORT}`);
  console.log(`Admin panel available at http://srv706843.hstgr.cloud:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  db.close();
  process.exit(0);
});

