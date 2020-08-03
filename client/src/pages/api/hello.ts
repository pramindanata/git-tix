import{NextApiResponse, NextApiRequest} from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
