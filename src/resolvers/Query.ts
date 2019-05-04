import { prismaObjectType } from 'nexus-prisma'

export const Query = prismaObjectType({
  name: 'Query',
  definition: t => {
    t.prismaFields(['*'])
    t.field('activeTimelog', {
      type: 'Timelog',
      nullable: true,
      resolve: (root, args, { prisma }) =>
        prisma.timelogs({ where: { finishDate: null } }).then(t => t[0])
    })
  }
})
