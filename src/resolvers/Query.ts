import { prismaObjectType } from 'nexus-prisma'
import TimelogRepository from '../repositories/TimelogRepository'

export const Query = prismaObjectType({
  name: 'Query',
  definition: t => {
    t.prismaFields(['*'])
    t.field('activeTimelog', {
      type: 'Timelog',
      nullable: true,
      resolve: (root, args, context) =>
        TimelogRepository.getActiveTimelog(context)
    })
  }
})
