import { Request, Response } from 'express';
import * as alertService from '../services/alert.service';

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await alertService.getUnreadAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

export const markRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await alertService.markAsRead(Number(id));
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
};
