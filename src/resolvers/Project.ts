import { prismaObjectType } from 'nexus-prisma'
import * as moment from 'moment'

export const Project = prismaObjectType({
  name: 'Project',
  definition: t => {
    t.prismaFields(['*'])
    t.field('estimateTime', {
      type: 'String',
      nullable: true,
      resolve: (root, args, { prisma }) => '05:05:05'
    })
    t.field('statusTime', {
      type: 'String',
      nullable: true,
      resolve: () => '05:05:05'
    })
  }
})
