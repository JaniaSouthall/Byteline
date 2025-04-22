const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const PORT = 5004;

app.use(cors());
app.use(bodyParser.json());

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('API is live!');
});

// ✅ Route handlers
try {
  app.use('/api/products', require('./routes/products'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/posts', require('./routes/posts'));
  app.use('/api/comments', require('./routes/comments'));
} catch (err) {
  console.error('Route error:', err.message);
}

app.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Server failed to start:', err.message);
  } else {
    console.log(`✅ Server running on port ${PORT}`);
  }
});
