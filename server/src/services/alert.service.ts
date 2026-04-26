import * as db from '../config/db';

export interface Alert {
  id: number;
  type: string;
  severity: string;
  message: string;
  item_id?: number;
  is_read: boolean;
  created_at: Date;
}

export const createAlert = async (type: string, severity: string, message: string, itemId?: number): Promise<Alert> => {
  const sql = `
    INSERT INTO alerts (type, severity, message, item_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await db.query(sql, [type, severity, message, itemId]);
  return rows[0] as Alert;
};

export const getUnreadAlerts = async (): Promise<Alert[]> => {
  const { rows } = await db.query('SELECT * FROM alerts WHERE is_read = FALSE ORDER BY created_at DESC');
  return rows as Alert[];
};

export const markAsRead = async (alertId: number): Promise<void> => {
  await db.query('UPDATE alerts SET is_read = TRUE WHERE id = $1', [alertId]);
};
