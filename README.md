# Blog API (Node.js + Express + MongoDB)

Backend final project with JWT authentication, RBAC, Joi validation, global error handling, modular structure and Bootstrap pages.

## Tech stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- `bcrypt`
- Joi
- Bootstrap 4 (static pages in `public/`)

## Requirements coverage

- Node + Express: yes
- MongoDB: yes
- 5 collections: `users`, `posts`, `comments`, `categories`, `postcategories`
- JWT auth: yes
- RBAC (`user`, `moderator`, `admin`) with permission matrix: yes
- Validation (Joi): yes
- Global error middleware: yes
- Bootstrap 4+ pages: yes (`index`, `login`, `register`, `dashboard`, `profile`)

## Project structure

```text
back-end-final/
  src/
    config/
      db.js
      env.js
    models/
      User.js
      Post.js
      Comment.js
      Category.js
      PostCategory.js
    controllers/
      authController.js
      userController.js
      postController.js
      categoryController.js
      commentController.js
    routes/
      authRoutes.js
      userRoutes.js
      postRoutes.js
      categoryRoutes.js
    middleware/
      authMiddleware.js
      roleMiddleware.js
      validate.js
      errorMiddleware.js
      notFound.js
    rbac/
      roles.js
      permissions.js
    scripts/
      promoteUserRole.js
    validators/
      authValidators.js
      userValidators.js
      postValidators.js
      categoryValidators.js
    app.js
    frontServer.js
    server.js
  public/
    app-common.js
    app-config.js
    index.html
    login.html
    register.html
    profile.html
    dashboard.html
    styles.css
  README.md
  package.json
```

## Setup and run

1. Install dependencies:

```bash
npm install
```

2. Create `.env` in project root:

```env
PORT=3000
FRONT_PORT=5173
MONGO_URI=mongodb://127.0.0.1:27017/blog_api
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
```

3. Start backend (API):

```bash
npm run dev:back
```

4. Start frontend (static pages) in a second terminal:

```bash
npm run dev:front
```

For non-watch mode use:

```bash
npm run start:back
npm run start:front
```

Open frontend in browser: `http://localhost:5173`
Open backend health check: `http://localhost:3000/health`

`npm run dev` and `npm start` still run backend for compatibility.

## Frontend -> backend URL

Frontend pages use `public/app-config.js`:

- Local default API base: `http://localhost:3000`
- Non-local default API base: current origin

If your backend uses another URL/port, set it from browser console once:

```js
localStorage.setItem("apiBase", "http://localhost:4000");
```

## Auth and RBAC rules

- Roles: `user`, `moderator`, `admin`
- Permission checks are centralized in `src/rbac/permissions.js` and applied in routes/middleware
- `user`: own posts (read/update/delete), comments (create/delete own), profile (read/update self)
- `moderator`: everything from `user` + can read any post and delete any comment
- `admin`: full access, including category creation and user role management
- `GET /posts/public` is public and returns only published posts
- `GET /posts` returns only posts created by authenticated user
- `GET /posts/:id/comments` is public for published posts (or available for own/any-post permissions on drafts)

### Bootstrap first admin

After registering a user, promote it to admin once from CLI:

```bash
npm run rbac:promote -- <email> admin
```

You can also set another role:

```bash
npm run rbac:promote -- <email> moderator
```

## API endpoints

`/register` and `/login` are also available as aliases for `/auth/register` and `/auth/login`.

| Method | URL | Auth | Body | Response (short) |
|---|---|---|---|---|
| POST | `/auth/register` | No | `username,email,password` | Created user |
| POST | `/auth/login` | No | `email,password` | JWT token + user |
| GET | `/categories` | No | - | Category list |
| POST | `/categories` | Bearer + permission `category:create` (`admin`) | `name,slug?` | Created category |
| GET | `/users/profile` | Bearer | - | Current user profile |
| PUT | `/users/profile` | Bearer | `username? email?` | Updated profile |
| GET | `/users` | Bearer + permission `user:read:any` (`admin`) | - | Users list |
| PATCH | `/users/:id/role` | Bearer + permission `user:role:update:any` (`admin`) | `role` | Updated user role |
| GET | `/posts/public` | No | - | Published posts |
| POST | `/posts` | Bearer | `title,content,tags?,isPublished?,categoryIds?` | Created post |
| GET | `/posts` | Bearer | - | Current user posts |
| GET | `/posts/:id` | Bearer | - | Post by id (own or `post:read:any`) |
| PUT | `/posts/:id` | Bearer | Any updatable post fields | Updated post (own or `post:update:any`) |
| DELETE | `/posts/:id` | Bearer | - | `{ message: "Deleted" }` (own or `post:delete:any`) |
| GET | `/posts/:id/comments` | Optional | - | Comments for post |
| POST | `/posts/:id/comments` | Bearer | `content` | Created comment |
| DELETE | `/posts/:id/comments/:commentId` | Bearer | - | `{ message: "Deleted" }` (own or `comment:delete:any`) |

## Sample requests

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"madi","email":"madi@example.com","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"madi@example.com","password":"123456"}'
```

### Create post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first post","content":"Long enough content here...","isPublished":true}'
```

## Notes

- Passwords are stored as `passwordHash` (`bcrypt`)
- Unknown routes return 404 JSON
- Validation errors return 400 JSON with `details`
- Duplicate fields (like unique email) return 409 JSON
