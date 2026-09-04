import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { apiLimiter, authLimiter } from './middleware/security.js';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import templatesRoutes from './routes/templatesRoutes.js';
import homeRoutes from './routes/homeRoutes.js';

import Template from './models/Template.js';
import SystemSettings from './models/SystemSettings.js';
import FaqItem from './models/FaqItem.js';

const app = express();

/* =========================================================
   SECURITY HEADERS
========================================================= */

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );

  next();
});

/* =========================================================
   CORS
========================================================= */

// Supports:
// CLIENT_URL=https://your-site.vercel.app
//
// Or multiple origins:
// CLIENT_URL=https://your-site.vercel.app,http://localhost:5173

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

// Always allow local development if CLIENT_URL is not configured
if (!allowedOrigins.includes('http://localhost:5173')) {
  allowedOrigins.push('http://localhost:5173');
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without Origin header
      // (Postman, server-to-server, health checks, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Explicit wildcard
      if (allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      // Exact allowed origin
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel deployments
      if (
        origin.startsWith('https://') &&
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
  })
);

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(apiLimiter);

app.use(
  express.json({
    limit: '2mb',
  })
);

/* =========================================================
   BASIC ROUTES
========================================================= */

// API root
app.get('/', (req, res) => {
  res.json({
    name: 'Height CV API',
    status: 'ok',
    message: 'Height CV backend is running',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

/* =========================================================
   API ROUTES
========================================================= */

// Authentication
app.use(
  '/api/auth',
  authLimiter,
  authRoutes
);

// Templates
app.use(
  '/api/templates',
  templatesRoutes
);

// Home statistics
app.use(
  '/api/home',
  homeRoutes
);

// CVs
app.use(
  '/api/cvs',
  cvRoutes
);

// Users
app.use(
  '/api/users',
  userRoutes
);

// Admin
app.use(
  '/api/admin',
  adminRoutes
);

// Support
app.use(
  '/api/support',
  supportRoutes
);

// AI / ATS / Job Match
app.use(
  '/api',
  analysisRoutes
);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  // CORS error
  if (err.message?.startsWith('CORS blocked origin')) {
    return res.status(403).json({
      message: 'CORS blocked',
      error: err.message,
    });
  }

  res.status(500).json({
    message: 'Server error',
  });
});

/* =========================================================
   SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

/* =========================================================
   DATABASE + SEED + START
========================================================= */

async function startServer() {
  try {
    // Connect MongoDB
    await connectDB();

    console.log('MongoDB connected successfully ✅');

    /* -----------------------------------------------------
       SYSTEM SETTINGS
    ----------------------------------------------------- */

    await SystemSettings.findOneAndUpdate(
      { key: 'global' },
      {
        $setOnInsert: {
          key: 'global',
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    /* -----------------------------------------------------
       TEMPLATE SEED
    ----------------------------------------------------- */

    const templateSeed = [
      {
        name: 'Minimal ATS',
        slug: 'minimal',
        description:
          'Clean single-column layout, maximum ATS compatibility.',
        accent: '#111827',
        category: 'minimal',
        isActive: true,
        isFeatured: true,
      },

      {
        name: 'Modern ATS',
        slug: 'modern',
        description:
          'Contemporary two-column layout with subtle accents.',
        accent: '#4F46E5',
        category: 'modern',
        isActive: true,
        isFeatured: true,
      },

      {
        name: 'Software Engineer',
        slug: 'software-engineer',
        description:
          'Optimized for engineering roles and technical skills.',
        accent: '#0EA5E9',
        category: 'technical',
        isActive: true,
        isFeatured: true,
      },

      {
        name: 'Student',
        slug: 'student',
        description:
          'Highlights projects and education for early-career applicants.',
        accent: '#16A34A',
        category: 'student',
        isActive: true,
        isFeatured: true,
      },

      {
        name: 'Professional',
        slug: 'professional',
        description:
          'Balanced layout suited for mid-career professionals.',
        accent: '#374151',
        category: 'professional',
        isActive: true,
        isFeatured: true,
      },

      {
        name: 'Executive',
        slug: 'executive',
        description:
          'Refined typography for senior leadership roles.',
        accent: '#7C2D12',
        category: 'executive',
        isActive: true,
        isFeatured: true,
      },
    ];

    for (const template of templateSeed) {
      await Template.findOneAndUpdate(
        {
          slug: template.slug,
        },
        {
          $set: {
            name: template.name,
            description: template.description,
            accent: template.accent,
            category: template.category,
            isActive: template.isActive,
            isFeatured: template.isFeatured,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log('Templates seeded successfully ✅');

    /* -----------------------------------------------------
       FAQ SEED
    ----------------------------------------------------- */

    const faqCount = await FaqItem.countDocuments();

    if (!faqCount) {
      await FaqItem.insertMany([
        {
          question: 'How do I create my first CV?',
          answer:
            'Go to Create CV, pick a template, then fill in your details in the builder. Your work autosaves as you type, so you never lose progress.',
          category: 'Getting started',
          order: 1,
        },

        {
          question:
            'What is the ATS score and how is it calculated?',
          answer:
            'The ATS Analyzer scores your CV on formatting, keywords, skills, experience, education and completeness. A higher score means your CV is easier for applicant tracking systems to read. Open the ATS Analyzer to see a full breakdown and improvement tips.',
          category: 'AI tools',
          order: 2,
        },

        {
          question: 'How does Job Match work?',
          answer:
            'Paste a job description into Job Match and we compare it against your CV, showing matched skills, missing skills and tailored recommendations so you can align your CV to the role.',
          category: 'AI tools',
          order: 3,
        },

        {
          question:
            'How do I download or print my CV?',
          answer:
            'Open your CV in the builder and use Export / Print. Your CV is rendered on an A4 page and you can save it as PDF straight from the print dialog.',
          category: 'CV',
          order: 4,
        },

        {
          question:
            'Can I switch between light and dark mode?',
          answer:
            'Yes. Use the theme toggle in the top bar, or set your preference (Light, Dark or System) in Settings. Your choice is remembered on this device.',
          category: 'Account',
          order: 5,
        },

        {
          question:
            'How do I change my password or delete my account?',
          answer:
            'Head to Settings > Security to change your password, or Settings > Danger zone to permanently delete your account and all associated CVs.',
          category: 'Account',
          order: 6,
        },

        {
          question: 'Is my data private?',
          answer:
            'Your CVs and account details are stored securely and are only visible to you. Administrators can see aggregate usage statistics but do not share your personal CV content.',
          category: 'Privacy',
          order: 7,
        },
      ]);

      console.log('FAQs seeded successfully ✅');
    }

    /* -----------------------------------------------------
       START SERVER
    ----------------------------------------------------- */

    app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `Height CV API running on port ${PORT} 🚀`
      );
    });
  } catch (error) {
    console.error('MongoDB Connection Failed ❌');
    console.error(error);
    console.error('REASON:', error?.reason);

    process.exit(1);
  }
}

/* =========================================================
   START
========================================================= */

startServer();