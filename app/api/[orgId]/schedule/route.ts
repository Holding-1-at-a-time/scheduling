import { NextApiRequest, NextApiResponse } from 'next';
import { llamaScheduler } from '@/lib/llamaScheduler'; // Assume we have a helper for llama model integration

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, appointmentDetails } = req.body;
        try {
            const schedule = await llamaScheduler(userId, appointmentDetails);
            res.status(200).json(schedule);
        } catch (error) {
            res.status(500).json({ error: 'Failed to schedule appointment' });
        }
    } else {
        res.status(405).end();
    }
}
