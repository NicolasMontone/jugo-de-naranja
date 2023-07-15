import type {
  VercelApiHandler,
  VercelRequest,
  VercelResponse,
} from '@vercel/node'

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse,
) => {
  console.log(req)

  res.status(200).json({ message: 'Ok' })
}

export default handler
