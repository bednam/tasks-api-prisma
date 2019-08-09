import { prismaObjectType } from 'nexus-prisma'
import { arg, stringArg } from 'nexus'
import TaskRepository from '../repositories/TaskRepository'
import TimelogRepository from '../repositories/TimelogRepository'
import UserRepository from '../repositories/UserRepository'

export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition: t => {
    t.prismaFields(['*'])
    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg(),
        password: stringArg()
      },
      resolve: async (parent, data, context) =>
        UserRepository.login(data, context)
    }),
      t.field('completeTask', {
        type: 'Task',
        args: { where: arg({ type: 'TaskWhereUniqueInput', nullable: false }) },
        resolve: async (root, { where }, context) =>
          TaskRepository.completeTask(where.id, context)
      })
    t.field('cloneTask', {
      type: 'Task',
      args: { where: arg({ type: 'TaskWhereUniqueInput' }) },
      resolve: async (root, { where }, context) =>
        TaskRepository.cloneTask(where.id, context)
    })
    t.field('stopTimelog', {
      type: 'Timelog',
      args: {
        where: arg({ type: 'TimelogWhereUniqueInput', nullable: false })
      },
      resolve: (root, { where }, context) =>
        TimelogRepository.stopTimelog(where.id, context)
    })
    t.field('startTimelog', {
      type: 'Timelog',
      args: { data: arg({ type: 'TimelogCreateInput' }) },
      resolve: async (root, { data }, context) =>
        TimelogRepository.startTimelog(data, context)
    })
  }
})
