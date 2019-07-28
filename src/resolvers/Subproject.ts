import { prismaObjectType } from 'nexus-prisma'
import * as moment from 'moment'
import SubprojectRepository from '../repositories/SubprojectRepository'

export const Subproject = prismaObjectType({
  name: 'Subproject',
  definition: t => {
    t.prismaFields(['*'])
    t.field('estimateTime', {
      type: 'String',
      nullable: true,
      resolve: (root, args, context) =>
        SubprojectRepository.getEstimateTime(id, context)
    })
    t.field('statusTime', {
      type: 'String',
      nullable: true,
      resolve: async (root, args, context) =>
        SubprojectRepository.getStatusTime(id, context)
    })
  }
})
