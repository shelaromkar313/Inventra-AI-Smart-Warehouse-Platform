// Mock data for initial task - Replace with DB calls in next milestone
const items = [
  { id: 1, name: 'Pallet Rack', quantity: 50, location: 'Zone A' },
  { id: 2, name: 'Forklift', quantity: 2, location: 'Loading Dock' }
];

exports.getAllItems = async (req, res) => {
  try {
    // const { rows } = await db.query('SELECT * FROM inventory');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const newItem = { id: items.length + 1, ...req.body };
    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
