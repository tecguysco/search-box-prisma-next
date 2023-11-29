import React from 'react'
import { getAllHistorys } from '../prisma/history'

const Historypage = ({ historys }) => {
  return (
    <div>
      {historys.map(history => (
        <div key={history.id}>{history.searchStr}</div>
      ))}
    </div>
  )
}

export const getServerSideProps = async ({ req }) => {
  const historys = await getAllHistorys()

  const updatedHistorys = historys.map(history => ({
    ...history,
    updatedAt: history.updatedAt.toString(),
    createdAt: history.createdAt.toString()
  }))

  return { props: { historys: updatedHistorys } }
}

export default Historypage
