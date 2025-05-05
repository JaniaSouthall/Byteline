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
  app.use('/api/laptops', require('./routes/laptops'));
  app.use('/api/peripherals', require('./routes/peripherals'));
  app.use('/api/accessories', require('./routes/accessories'));
  app.use('/api/search', require('./routes/search'));
  app.use('/api/login', require('./routes/login'));
  app.use('/api/cart', require('./routes/cart'));
  app.use('/api/signup', require('./routes/signup'));
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
