import { prismaObjectType, prismaInputObjectType } from 'nexus-prisma'
import { subscriptionField, arg } from 'nexus'
import * as moment from 'moment'
import TaskRepository from '../repositories/TaskRepository'

export const Task = prismaObjectType({
  name: 'Task',
  definition: t => {
    t.prismaFields(['*'])
    t.field('project', {
      type: 'Project',
      nullable: true,
      resolve: (root, args, context) =>
        TaskRepository.getProject(root.id, context)
    })
    t.string('statusTime', {
      nullable: true,
      resolve: (root, args, context) =>
        TaskRepository.getStatusTime(root.id, context)
    })
    t.string('latestTimelogStartDate', {
      nullable: true,
      resolve: (root, args, context) =>
        TaskRepository.getLatestTimelogStartDate(root.id, context)
    }),
      t.string('timelogCount', {
        resolve: (root, args, context) =>
          TaskRepository.getTimelogCount(root.id, context)
      })
  }
})

export const TaskSubscription = subscriptionField('task', {
  type: 'TaskSubscriptionPayload',
  args: { where: arg({ type: 'TaskSubscriptionWhereInput', nullable: false }) },
  subscribe: (root, args, ctx) => ctx.prisma.$subscribe.task(args.where) as any,
  resolve: payload => payload
})

export const TaskSubscriptionWhereInput = prismaInputObjectType({
  name: 'TaskSubscriptionWhereInput',
  definition(t) {
    t.prismaFields(['*'])
  }
})
