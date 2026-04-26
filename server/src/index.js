const express = require('express');
const cors = require('cors');
require('dotenv').config();

const inventoryRoutes = require('./routes/inventory.routes');
const initDb = require('./config/initDb');

const app = express();
const PORT = process.env.PORT || 5000;

// Check for DB Init flag
if (process.argv.includes('--init-db')) {
  initDb().then(() => process.exit(0));
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Smart Warehouse API v1' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
