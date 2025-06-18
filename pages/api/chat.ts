import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { message } = req.body;

      // Simulated response
      const reply = "I'm just a bot, but I'll try to help!";

      res.status(200).json({ text: reply });
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
