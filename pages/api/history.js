import {
  createHistory,
  deleteHistory,
  getAllHistorys,
  getHistory,
  updateHistory
} from '../../prisma/history'

export default async function handle (req, res) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id) {
          // Get a single history if id is provided is the query
          // api/historys?id=1
          const history = await getHistory(req.query.id)
          return res.status(200).json(history)
        } else {
          // Otherwise, fetch all historys
          const historys = await getAllHistorys()
          return res.json(historys)
        }
      }
      case 'POST': {
        // Create a new history
        const { email, name, birthYear } = req.body
        const history = await createHistory(email, name, birthYear)
        return res.json(history)
      }
      case 'PUT': {
        // Update an existing history
        const { id, ...updateData } = req.body
        const history = await updateHistory(id, updateData)
        return res.json(history)
      }
      case 'DELETE': {
        // Delete an existing history
        const { id } = req.body
        const history = await deleteHistory(id)
        return res.json(history)
      }
      default:
        break
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message })
  }
}
