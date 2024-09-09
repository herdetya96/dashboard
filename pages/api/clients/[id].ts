import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const clientId = parseInt(id as string)

  if (req.method === 'PUT') {
    const updatedClient = db.clients.update({ ...req.body, id: clientId })
    res.status(200).json(updatedClient)
  } else if (req.method === 'DELETE') {
    db.clients.delete(clientId)
    res.status(204).end()
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}