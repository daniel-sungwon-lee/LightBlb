require('dotenv/config');
const express = require('express');
const pg = require('pg');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const path = require('path');
const port = process.env.PORT || 3001;

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

//static-middleware
const publicPath = path.join(__dirname, 'public');
const staticMiddleware = express.static(publicPath);

app.use(staticMiddleware);

app.use(express.json());

//client-error
class ClientError {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

//error-middleware
function errorMiddleware(err, req, res, next) {
  if (err instanceof ClientError) {
    res.status(err.status).json({
      error: err.message
    });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
}

//API endpoints

//auth
app.post('/api/signup', (req, res, next) => {
  const { email, password } = req.body;

  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
     insert into "users" ("email", "hashedPassword")
     values ($1, $2)
     `;
      const params = [email, hashedPassword];

      db.query(sql, params)
        .then(result => {
          res.status(201).json(result.rows[0]);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.post('/api/login', (req, res, next) => {
  const { email, password } = req.body;

  const sql = `
  select "userId", "hashedPassword", "email"
  from "users"
  where "email" = $1
  `;
  const params = [email];

  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'Invalid login');
      }
      const { userId, hashedPassword, email } = user;
      argon2
        .verify(hashedPassword, password)
        .then(isMatch => {
          if (!isMatch) {
            throw new ClientError(401, 'Invalid login');
          }
          const payload = { userId, email };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

//post
app.post('/api/post', (req, res, next) => {
  const { userId, content } = req.body;

  const sql = `
  insert into "posts" ("userId", "content")
  values ($1, $2)
  `;
  const params = [userId, content]

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0])
    })
    .catch(err => next(err))
})

//profile (posts)
app.get('/api/posts/:userId', (req, res, next) => {
  const userId = req.params.userId;

  const sql = `
  select * from "posts"
  where "userId" = $1
  order by "postId" desc
  `;
  const params = [userId];

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
})

app.get('/api/posts/:userId/:postId', (req, res, next) => {
  const { userId, postId } = req.params;

  const sql = `
  select * from "posts"
  where "userId" = $1
  and "postId" = $2
  `;
  const params = [userId, postId];

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
})

app.patch('/api/posts/:userId/:postId', (req, res, next) => {
  const { userId, postId } = req.params
  const { content } = req.body

  const sql = `
  update "posts"
  set "content" = $3
  where "userId" = $1
  and "postId" = $2
  `
  const params = [userId, postId, content]

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows[0])
    })
    .catch(err => next(err))
})

app.delete('/api/posts/:userId/:postId', (req, res, next) => {
  const { userId, postId } = req.params

  const sql = `
  delete from "posts"
  where "userId" = $1
  and "postId" = $2
  `
  const params = [userId, postId]

  db.query(sql, params)
    .then(result => {
      res.status(204).json(result.rows[0])
    })
    .catch(err => next(err));
})

//to delete post even if it has been saved
app.delete('/api/saved/:postId', (req, res, next) => {
  const { postId } = req.params

  const sql = `
  delete from "saved"
  where "postId" = $1
  `
  const params = [postId]

  db.query(sql, params)
    .then(result => {
      res.status(204).json(result.rows[0])
    })
    .catch(err => next(err));
})

app.delete('/api/comments/:postId', (req, res, next) => {
  const { postId } = req.params

  const sql = `
  delete from "comments"
  where "postId" = $1
  `
  const params = [postId]

  db.query(sql, params)
    .then(result => {
      res.status(204).json(result.rows[0])
    })
    .catch(err => next(err));
})

//home
app.get('/api/posts', (req, res, next) => {
  const sql = `
  select * from "posts"
  order by "postId" desc
  `;

  db.query(sql)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
})

app.post('/api/saved', (req, res, next) => {
  const { postId, userId } = req.body;

  const sql = `
  insert into "saved" ("postId", "userId")
  values ($1, $2)
  `;
  const params = [postId, userId]

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0])
    })
    .catch(err => next(err))
})

app.delete('/api/saved/:postId/:userId', (req, res, next) => {
  const { postId, userId } = req.params

  const sql = `
  delete from "saved"
  where "postId" = $1
  and "userId" = $2
  `
  const params = [postId, userId]

  db.query(sql, params)
    .then(result => {
      res.status(204).json(result.rows[0])
    })
    .catch(err => next(err));
})

app.get('/api/saved/:userId', (req, res, next) => {
  const { userId } = req.params;

  const sql = `
  select * from "saved"
  where "userId" = $1
  order  by "postId" desc
  `;
  const params = [userId]

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
})

//comment
app.post('/api/comments', (req, res, next) => {
  const { postId, userId, comment } = req.body;

  const sql = `
  insert into "comments" ("postId", "userId", "comment")
  values ($1, $2, $3)
  `;
  const params = [postId, userId, comment]

  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0])
    })
    .catch(err => next(err))
})

app.get('/api/comments/:postId', (req, res, next) => {
  const { postId } = req.params;

  const sql = `
  select * from "comments"
  where "postId" = $1
  order  by "commentId"
  `;
  const params = [postId]

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
})

app.delete('/api/comment/:commentId', (req, res, next) => {
  const { commentId } = req.params

  const sql = `
  delete from "comments"
  where "commentId" = $1
  `
  const params = [commentId]

  db.query(sql, params)
    .then(result => {
      res.status(204).json(result.rows[0])
    })
    .catch(err => next(err));
})

//profile (saved)
app.get('/api/profile/saved/:userId', (req, res, next) => {
  const { userId } = req.params;

  const sql = `
  select "saved"."postId",
         "posts"."userId",
         "posts"."content"
  from "saved"
  join "posts" using ("postId")
  where "saved"."userId" = $1
  order  by "postId" desc
  `
  const params = [userId]

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err));
})

//for Heroku deployment
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`express server listening on ${port}`)
})
