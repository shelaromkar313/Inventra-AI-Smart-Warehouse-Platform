import { Request, Response } from 'express';
import * as db from '../config/db';

export interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  sku: string;
  quantity: number;
  location?: string;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query('SELECT * FROM inventory ORDER BY created_at DESC');
    res.json(rows as InventoryItem[]);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Database error fetching inventory' });
  }
};

export const createItem = async (req: Request, res: Response) => {
  const { name, description, sku, quantity, location, price } = req.body;
  
  if (!name || !sku) {
    return res.status(400).json({ error: 'Name and SKU are required' });
  }

  try {
    const sql = `
      INSERT INTO inventory (name, description, sku, quantity, location, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [name, description, sku, quantity, location, price];
    
    const { rows } = await db.query(sql, values);
    res.status(201).json(rows[0] as InventoryItem);
  } catch (error: any) {
    console.error('Error creating item:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Database error creating inventory item' });
  }
};
