import { prismaObjectType } from 'nexus-prisma'
import * as moment from 'moment'

export const Task = prismaObjectType({
  name: 'Task',
  definition: t => {
    t.prismaFields(['*'])
    t.field('project', {
      type: 'Project',
      nullable: true,
      resolve: (root, args, ctx) =>
        ctx.prisma
          .task({ id: root.id })
          .subproject()
          .project()
    })
    t.string('statusTime', {
      nullable: true,
      resolve: async (root, args, { prisma }) => {
        const timelogs = await prisma.task({ id: root.id }).timelogs()

        const duration = timelogs.reduce(
          (acc, curr) =>
            acc.add(moment(curr.finishDate).diff(moment(curr.startDate))),
          moment.duration(0)
        )

        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
      }
    })
    t.string('latestTimelogStartDate', {
      nullable: true,
      resolve: async (root, args, { prisma }) => {
        const [latestTimelog] = await prisma
          .task({ id: root.id })
          .timelogs({ orderBy: 'startDate_DESC' })

        return latestTimelog ? latestTimelog.startDate : null
      }
    }),
      t.string('timelogCount', {
        resolve: async (root, args, { prisma }) =>
          await prisma
            .timelogsConnection({ where: { task: { id: root.id } } })
            .aggregate()
            .count()
      })
  }
})
