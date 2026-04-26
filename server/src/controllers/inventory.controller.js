const db = require('../config/db');

exports.getAllItems = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM inventory ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Database error fetching inventory' });
  }
};

exports.createItem = async (req, res) => {
  const { name, description, sku, quantity, location, price } = req.body;
  
  if (!name || !sku) {
    return res.status(400).json({ error: 'Name and SKU are required' });
  }

  try {
    const query = `
      INSERT INTO inventory (name, description, sku, quantity, location, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [name, description, sku, quantity, location, price];
    
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating item:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Database error creating inventory item' });
  }
};
