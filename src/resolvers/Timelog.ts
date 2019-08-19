import { prismaInputObjectType } from 'nexus-prisma'
import { subscriptionField, arg } from 'nexus'

export const TimelogSubscription = subscriptionField('timelog', {
	type: 'TimelogSubscriptionPayload',
	args: {
		where: arg({ type: 'TimelogSubscriptionWhereInput', nullable: false })
	},
	subscribe: (root, args, ctx) =>
		ctx.prisma.$subscribe.timelog(args.where) as any,
	resolve: payload => payload
})

export const TimelogSubscriptionWhereInput = prismaInputObjectType({
	name: 'TimelogSubscriptionWhereInput',
	definition(t) {
		t.prismaFields(['*'])
	}
})
