import { prismaObjectType } from 'nexus-prisma'
import { arg, stringArg } from 'nexus'
import { aggregateTime, aggregateTimeDiff, dateToMilliseconds } from '../utils/'
import TagRepository from '../repositories/TagRepository'
/*
	TODO
	- move business logic to TagRepository
	- refactor repeatable logic in repositories
	- test resolvers
*/
export const Tag = prismaObjectType({
	name: 'Tag',
	definition: t => {
		t.prismaFields(['*'])
		t.field('statusTime', {
			type: 'String',
			args: {
				timelogs_every: arg({
					type: 'TimelogWhereInput',
					nullable: false
				})
			},
			resolve: TagRepository.getStatusTime
		})
		t.field('statusMs', {
			type: 'Long',
			args: {
				timelogs_every: arg({
					type: 'TimelogWhereInput'
				})
			},
			resolve: TagRepository.getStatusMs
		})
	}
})
