import { prismaObjectType, prismaInputObjectType } from 'nexus-prisma'
import { arg, stringArg, subscriptionField } from 'nexus'
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
					type: 'TimelogWhereInput'
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

export const TagSubscription = subscriptionField('tag', {
	type: 'TagSubscriptionPayload',
	args: {
		where: arg({ type: 'TagSubscriptionWhereInput', nullable: false })
	},
	subscribe: (root, args, ctx) =>
		ctx.prisma.$subscribe.tag(args.where) as any,
	resolve: payload => payload
})

export const TagSubscriptionWhereInput = prismaInputObjectType({
	name: 'TagSubscriptionWhereInput',
	definition(t) {
		t.prismaFields(['*'])
	}
})
