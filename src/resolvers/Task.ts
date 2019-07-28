import { prismaObjectType } from 'nexus-prisma'
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
