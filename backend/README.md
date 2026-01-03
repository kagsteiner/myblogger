# Blog Comment System

A simple, self-hosted comment system for static blogs hosted on neocities.org (or similar platforms).

## Features

- **Simple integration**: Add comments to any blog page with a single `<script>` tag
- **Moderation**: All comments require approval before becoming visible
- **Rate limiting**: Protection against spam (1 comment/minute, 10 comments/hour per IP)
- **XSS protection**: All user input is sanitized
- **JWT authentication**: Secure moderator login
- **SQLite database**: No external database server required

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy `sample-env.txt` to `.env`:

```bash
cp sample-env.txt .env
```

### 3. Generate admin password hash

```bash
node generate-password.js yourSecretPassword
```

Copy the output hash to your `.env` file as `ADMIN_PASSWORD_HASH`.

### 4. Update JWT secret

Edit `.env` and set a secure random string for `JWT_SECRET`.

### 5. Start the server

```bash
npm start
```

The server will run on port 3003 by default.

## Integration

### Adding comments to your blog

Add these two lines to your HTML blog entries, typically at the bottom of the `<body>`:

```html
<div id="comments"></div>
<script src="http://srv706843.hstgr.cloud:3003/comments.js"></script>
```

The blog entry ID is automatically extracted from the URL. Expected filename pattern:
- `019_my_blog_post_en.html` → ID: `019_en`
- `019_my_blog_post_de.html` → ID: `019_de`

### Moderating comments

Visit `http://srv706843.hstgr.cloud:3003/admin` and log in with your password.

From the admin panel you can:
- View all pending comments
- Delete inappropriate comments
- Release all approved comments at once

## API Endpoints

### Public Endpoints

#### `POST /api/comments`
Add a new comment (requires moderation).

```json
{
  "blogEntryId": "019_en",
  "name": "John Doe",
  "text": "Great article!"
}
```

#### `GET /api/comments?blogEntryId=019_en`
Get released comments for a blog entry.

### Authenticated Endpoints

#### `POST /api/login`
Authenticate as moderator.

```json
{
  "password": "yourPassword"
}
```

Returns: `{ "token": "jwt-token" }`

#### `GET /api/comments?role=moderator&blogEntryId=all`
Get all pending (unreleased) comments.

Header: `Authorization: Bearer <token>`

#### `DELETE /api/comments/:commentId`
Delete a comment.

Header: `Authorization: Bearer <token>`

#### `POST /api/comments/release`
Release all pending comments globally.

Header: `Authorization: Bearer <token>`

## Security Features

- **CORS**: Only allows requests from `*.neocities.org` and localhost
- **Rate limiting**: 
  - General: 100 requests per 15 minutes
  - Comments: 1 per minute, 10 per hour
- **Input sanitization**: XSS protection using the `xss` library
- **Helmet**: Security headers (CSP, X-Frame-Options, etc.)
- **Password hashing**: bcrypt with salt rounds

## Production Deployment

For production on `srv706843.hstgr.cloud`:

1. Copy the `backend` folder to the server
2. Install dependencies: `npm install --production`
3. Create `.env` file with secure values
4. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name "comment-system"
pm2 save
pm2 startup
```

5. Configure your reverse proxy (nginx/Apache) if needed

## Database

SQLite database is stored in `comments.db`. The schema:

| Column | Type | Description |
|--------|------|-------------|
| commentId | INTEGER | Auto-increment primary key |
| blogEntryId | TEXT | Blog entry identifier |
| name | TEXT | Commenter's name |
| text | TEXT | Comment content |
| released | INTEGER | 0=pending, 1=released |
| createdAt | TEXT | ISO timestamp |

## File Structure

```
backend/
├── server.js           # Main application
├── package.json        # Dependencies
├── sample-env.txt      # Environment template
├── generate-password.js # Password hash generator
├── .gitignore          # Git ignore rules
├── README.md           # This file
└── public/
    ├── admin.html      # Moderator interface
    └── comments.js     # Embeddable frontend script
```

