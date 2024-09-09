import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const clients = db.clients.getAll()
    res.status(200).json(clients)
  } else if (req.method === 'POST') {
    const newClient = db.clients.add(req.body)
    res.status(201).json(newClient)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}