import prisma from './prisma'

export const getAllHistorys = async () => {
  const historys = await prisma.history.findMany({})
  return historys
}

export const getHistory = async id => {
  const history = await prisma.history.findUnique({
    where: { id }
  })
  return history
}

export const createHistory = async (searchStr) => {
  const history = await prisma.history.create({
    data: {
      searchStr
    }
  })
  return history
}

export const updateHistory = async (id, updateData) => {
  const history = await prisma.history.update({
    where: {
      id
    },
    data: {
      ...updateData
    }
  })
  return history
}

export const deleteHistory = async (id) => {
  const history = await prisma.history.delete({
    where: {
      id
    }
  })
  return history
}
