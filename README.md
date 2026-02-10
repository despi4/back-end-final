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
- RBAC (`user`, `admin`): yes
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
    validators/
      authValidators.js
      userValidators.js
      postValidators.js
      categoryValidators.js
    app.js
    server.js
  public/
    index.html
    login.html
    register.html
    profile.html
    dashboard.html
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
MONGO_URI=mongodb://127.0.0.1:27017/blog_api
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
```

3. Start dev server:

```bash
npm run dev
```

4. Production start:

```bash
npm start
```

Open app in browser: `http://localhost:3000`

## Auth and RBAC rules

- Roles: `user`, `admin`
- `user` can update/delete only own posts/comments
- `admin` can update/delete any post/comment
- `GET /posts/public` is public and returns only published posts
- `GET /posts` returns only posts created by authenticated user
- `GET /posts/:id/comments` is public for published posts (or private with token for drafts)

## API endpoints

`/register` and `/login` are also available as aliases for `/auth/register` and `/auth/login`.

| Method | URL | Auth | Body | Response (short) |
|---|---|---|---|---|
| POST | `/auth/register` | No | `username,email,password` | Created user |
| POST | `/auth/login` | No | `email,password` | JWT token + user |
| GET | `/categories` | No | - | Category list |
| POST | `/categories` | Bearer (`admin`) | `name,slug?` | Created category |
| GET | `/users/profile` | Bearer | - | Current user profile |
| PUT | `/users/profile` | Bearer | `username? email?` | Updated profile |
| GET | `/posts/public` | No | - | Published posts |
| POST | `/posts` | Bearer | `title,content,tags?,isPublished?,categoryIds?` | Created post |
| GET | `/posts` | Bearer | - | Current user posts |
| GET | `/posts/:id` | Bearer | - | Post by id (owner/admin) |
| PUT | `/posts/:id` | Bearer | Any updatable post fields | Updated post |
| DELETE | `/posts/:id` | Bearer | - | `{ message: "Deleted" }` |
| GET | `/posts/:id/comments` | Optional | - | Comments for post |
| POST | `/posts/:id/comments` | Bearer | `content` | Created comment |
| DELETE | `/posts/:id/comments/:commentId` | Bearer | - | `{ message: "Deleted" }` |

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
