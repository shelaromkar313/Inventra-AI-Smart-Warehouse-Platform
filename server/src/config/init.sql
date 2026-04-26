-- Create Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    quantity INTEGER DEFAULT 0,
    location VARCHAR(100),
    price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster SKU and Name searches
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_inventory_name ON inventory(name);

-- Mock Seeding
INSERT INTO inventory (name, description, sku, quantity, location, price)
VALUES 
('Industrial Shelf Unit', 'Heavy duty steel shelving', 'SHLF-001', 45, 'Zone A-1', 120.50),
('Forklift Battery', '72V Lithium-ion battery', 'BATT-002', 12, 'Storage Room B', 4500.00),
('Hand Pallet Jack', 'Manual hydraulic lift', 'JACK-003', 8, 'Dock Area', 299.99)
ON CONFLICT (sku) DO NOTHING;

-- Create Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'LOW_STOCK', 'SECURITY', 'SYSTEM'
    severity VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    message TEXT NOT NULL,
    item_id INTEGER REFERENCES inventory(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Alerts
INSERT INTO alerts (type, severity, message, item_id)
VALUES 
('SYSTEM', 'LOW', 'Smart Warehouse System initialized successfully', NULL),
('LOW_STOCK', 'MEDIUM', 'Forklift Battery stock is below threshold (5)', 2);
