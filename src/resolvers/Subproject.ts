import { prismaObjectType } from 'nexus-prisma'
import * as moment from 'moment'

export const Subproject = prismaObjectType({
  name: 'Subproject',
  definition: t => {
    t.prismaFields(['*'])
    t.field('estimateTime', {
      type: 'String',
      nullable: true,
      resolve: async (root, args, { prisma }) => {
        const tasks = await prisma.subproject({ id: root.id }).tasks()

        const estimateTime = tasks.reduce(
          (acc, curr) => acc.add(moment.duration(curr.estimateTime)),
          moment.duration(0)
        )

        return moment.utc(estimateTime.as('milliseconds')).format('HH:mm:ss')
      }
    })
    t.field('statusTime', {
      type: 'String',
      nullable: true,
      resolve: async (root, args, { prisma }) => {
        const timelogs = await prisma
          .subproject({ id: root.id })
          .tasks()
          .then(tasks =>
            tasks.reduce((acc, curr) => [...acc, ...curr.timelogs()], [])
          )

        const duration = timelogs.reduce(
          (acc, curr) =>
            acc.add(moment(curr.finishDate).diff(moment(curr.startDate))),
          moment.duration(0)
        )

        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
      }
    })
  }
})
