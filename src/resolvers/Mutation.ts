import { prismaObjectType } from 'nexus-prisma'
import { arg } from 'nexus'
import * as moment from 'moment'

export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition: t => {
    t.prismaFields(['*'])
    t.field('completeTask', {
      type: 'Task',
      args: { where: arg({ type: 'TaskWhereUniqueInput', nullable: false }) },
      resolve: async (root, { where }, { prisma }) => {
        const task = await prisma.task({ id: where.id })
        return prisma.updateTask({
          data: {
            completed: !task.completed,
            finishDate: task.finishDate ? null : moment().format()
          },
          where
        })
      }
    })
    t.field('stopTimelog', {
      type: 'Timelog',
      args: {
        where: arg({ type: 'TimelogWhereUniqueInput', nullable: false })
      },
      resolve: (root, { where }, { prisma }) =>
        prisma.updateTimelog({
          data: { finishDate: moment().format() },
          where
        })
    })

    t.field('startTimelog', {
      type: 'Timelog',
      args: { data: arg({ type: 'TimelogCreateInput' }) },
      resolve: (root, { data }, { prisma }) =>
        prisma.createTimelog({
          startDate: moment().format(),
          ...data
        })
    })
  }
})
