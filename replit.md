# Blood Donor Finder Application

## Overview

Blood Donor Finder is a web-based platform that connects blood donors with recipients in real-time. The application allows users to register as blood donors, search for donors by blood group and location, manage donor profiles, and maintain a history of blood donation activities. Built with a simple Express.js backend and vanilla HTML/CSS/JavaScript frontend, the system uses MongoDB for data persistence.

## Recent Changes (November 2025)

- Made website fully responsive for mobile and laptop screens
- Added hamburger menu navigation for mobile devices
- Updated all HTML pages with responsive design
- Server runs on port 5000 for Replit environment
- Configured deployment for autoscale
- Added 480px and 360px breakpoints for better mobile UI on small screens
- Made hamburger menu accessible with button element, aria attributes and keyboard support (Escape key)
- Improved form, button and content layout for mobile devices

## User Preferences

Preferred communication style: Simple, everyday language (Hindi/Hinglish preferred).

## System Architecture

### Frontend Architecture

**Technology Stack**: Vanilla HTML, CSS, and JavaScript with Tailwind CSS for styling

**Design Pattern**: Multi-page application (MPA) with server-side rendering
- Each feature has a dedicated HTML page (register.html, finddonor.html, profile.html, delete.html, about.html)
- Shared navigation component across all pages using hamburger menu for mobile responsiveness
- Consistent visual design with semi-transparent content boxes overlaying a fixed background image
- Client-side form validation and data submission

**Rationale**: Chosen for simplicity and ease of deployment without build steps. The MPA approach provides fast initial page loads and is SEO-friendly, which is important for a public service application.

### Backend Architecture

**Technology Stack**: Node.js with Express.js framework

**Design Pattern**: Simple RESTful API with direct MongoDB integration
- Single server.js file handles all routes and middleware
- Static file serving for HTML, CSS, and JavaScript assets
- Direct Mongoose model imports for database operations
- Minimal middleware configuration

**Rationale**: Express.js provides a lightweight, flexible framework suitable for this application's scope. The simple architecture avoids over-engineering while maintaining scalability for future feature additions.

**Alternatives Considered**:
- Full-stack frameworks (Next.js, Nuxt.js) - Rejected due to added complexity for current requirements
- Serverless functions - Partially implemented via Vercel deployment

**Pros**:
- Quick development and deployment
- Low resource requirements
- Easy to understand and maintain

**Cons**:
- Limited separation of concerns
- May require refactoring as application grows

### Data Storage Solutions

**Database**: MongoDB (Cloud-hosted via MongoDB Atlas)

**Connection String**: Hardcoded in server.js (mongodb+srv://blood:blood1234@blood-donor.s0bwrss.mongodb.net/)

**Schema Design**: Three Mongoose models defining data structure:

1. **Donor Model** (module/module.js - Collection: 'donors')
   - Stores active blood donor registrations
   - Fields: name, tehsil (administrative region), bloodgroup, village, contact, Whatsapp, password, date
   - Password stored in plain text (security concern)

2. **History Model** (module/history.js - Collection: 'history')
   - Maintains historical records of donor activities
   - Identical schema to Donor model
   - Enables audit trail and data recovery

3. **Account Model** (module/account.js - Collection: 'account')
   - Stores user authentication credentials
   - Fields: contact (Number), password (String)
   - Minimal authentication system

**Rationale**: MongoDB chosen for:
- Flexible schema for evolving requirements
- Easy cloud hosting via Atlas
- Good performance for read-heavy operations (donor searches)
- Native JSON support simplifies data exchange with frontend

**Security Concerns**:
- Passwords stored in plain text - should be hashed using bcrypt or similar
- Database credentials exposed in source code - should use environment variables
- No input sanitization visible - vulnerable to injection attacks

### Authentication and Authorization

**Current Implementation**: Basic password-based authentication
- Contact number used as unique identifier
- Passwords stored without hashing
- No session management or JWT tokens visible in codebase
- No role-based access control

**Rationale**: Minimal viable implementation to demonstrate functionality

**Required Improvements**:
- Implement password hashing (bcrypt)
- Add session management or JWT tokens
- Implement proper authorization middleware
- Add rate limiting for login attempts

### Deployment Architecture

**Platform**: Vercel serverless deployment

**Configuration** (vercel.json):
- Server.js deployed as serverless function (@vercel/node)
- All routes proxied through server.js
- Static assets served from public directory
- Build command: npm run build (currently placeholder)

**Rationale**: Vercel provides:
- Zero-configuration deployment
- Automatic HTTPS
- Global CDN for static assets
- Serverless scaling
- Free tier suitable for proof-of-concept

**Considerations**:
- MongoDB connection pooling may need optimization for serverless environment
- Cold starts may affect initial request latency

## External Dependencies

### Third-Party Services

1. **MongoDB Atlas**
   - Purpose: Cloud-hosted database service
   - Integration: Mongoose ODM via connection string
   - Configuration: Cluster name "blood-donor", database "blood-donor"

2. **Vercel**
   - Purpose: Hosting and deployment platform
   - Integration: Git-based deployment with vercel.json configuration
   - Features: Serverless functions, static asset hosting, automatic HTTPS

3. **Tailwind CSS CDN**
   - Purpose: Utility-first CSS framework
   - Integration: Loaded via CDN script tag in HTML files
   - Version: Latest (unversioned CDN link)

4. **Google Fonts**
   - Purpose: Custom typography (Noto Sans Devanagari for Hindi language support)
   - Integration: CSS import in HTML files

5. **ImgBB**
   - Purpose: Image hosting for background images
   - Integration: Direct URL references in CSS

### NPM Dependencies

1. **express** (^5.1.0)
   - Purpose: Web application framework
   - Usage: HTTP server, routing, middleware

2. **mongoose** (^8.15.0)
   - Purpose: MongoDB ODM
   - Usage: Database schema definition, queries, connection management

3. **nodemon** (^3.1.10)
   - Purpose: Development tool for auto-restarting server
   - Usage: Development workflow only

4. **moongose** (^1.0.0)
   - Note: This appears to be a typo/duplicate of mongoose and should be removed

### API Structure

**Current State**: No explicit API routes defined in provided code

**Expected Routes** (based on HTML pages):
- POST /register - Donor registration
- POST /find - Search for donors
- GET /profile - View donor profile
- POST /delete - Delete donor record
- POST /login - User authentication

**Data Exchange Format**: JSON (standard for Express.js applications)

### External Integrations

**Google Site Verification**: Meta tag present for Google Search Console verification (code: xaYMuI-8vqFr7OAieQo3WbQWHr17UPPNkl9pfn0jJvA)

**SEO Optimization**:
- Open Graph tags for social media sharing
- Twitter Card metadata
- Structured data (JSON-LD) for search engines
- Canonical URLs