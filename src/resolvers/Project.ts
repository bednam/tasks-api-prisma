import { prismaObjectType } from 'nexus-prisma'
import * as moment from 'moment'
import ProjectRepository from '../repositories/ProjectRepository'

export const Project = prismaObjectType({
  name: 'Project',
  definition: t => {
    t.prismaFields(['*'])
    t.field('estimateTime', {
      type: 'String',
      nullable: true,
      resolve: (root, args, context) =>
        ProjectRepository.getEstimateTime(root.id, context)
    })
    t.field('statusTime', {
      type: 'String',
      nullable: true,
      resolve: (root, args, context) =>
        ProjectRepository.getStatusTime(root.id, context)
    })
  }
})
