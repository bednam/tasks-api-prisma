// TODO find cleaner way to resolve estimateTime and statusTime, reuse code
import { prismaObjectType } from 'nexus-prisma'
import * as moment from 'moment'

export const Project = prismaObjectType({
  name: 'Project',
  definition: t => {
    t.prismaFields(['*'])
    t.field('estimateTime', {
      type: 'String',
      nullable: true,
      resolve: async (root, args, { prisma }) => {
        const subprojects = await prisma.project({ id: root.id }).subprojects()

        const OR = subprojects.map(({ id }) => ({ subproject: { id } }))

        const tasks = await prisma.tasks({
          where: {
            OR
          }
        })

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
        const subprojects = await prisma.project({ id: root.id }).subprojects()

        const tasks = await prisma.tasks({
          where: {
            OR: subprojects.map(({ id }) => ({ subproject: { id } }))
          }
        })

        const timelogs = await prisma.timelogs({
          where: {
            OR: tasks.map(({ id }) => ({ task: { id } }))
          }
        })

        const statusTime = timelogs.reduce(
          (acc, curr) =>
            acc.add(moment(curr.finishDate).diff(moment(curr.startDate))),
          moment.duration(0)
        )

        return moment.utc(statusTime.as('milliseconds')).format('HH:mm:ss')
      }
    })
  }
})
