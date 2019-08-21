import { prismaObjectType } from 'nexus-prisma'
import { arg, stringArg } from 'nexus'
import { aggregateTime, aggregateTimeDiff, dateToMilliseconds } from '../utils/'

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
			nullable: true,
			resolve: async (root, args, context) => {
				const { timelogs_every } = args
				const taskIds = await context.prisma
					.tag({ id: root.id })
					.tasks()
					.then(tasks => tasks.map(({ id }) => id))

				const timelogs = await context.prisma.timelogs({
					where: { task: { id_in: taskIds }, ...timelogs_every }
				})

				return aggregateTimeDiff(
					timelogs,
					t => t.startDate,
					t => t.finishDate
				)
			}
		})
		t.field('statusMs', {
			type: 'Long',
			args: {
				timelogs_every: arg({
					type: 'TimelogWhereInput'
				})
			},
			resolve: async (root, args, context) => {
				const { timelogs_every } = args
				const taskIds = await context.prisma
					.tag({ id: root.id })
					.tasks()
					.then(tasks => tasks.map(({ id }) => id))

				const timelogs = await context.prisma.timelogs({
					where: { task: { id_in: taskIds }, ...timelogs_every }
				})

				return aggregateTimeDiff(
					timelogs,
					t => t.startDate,
					t => t.finishDate,
					dateToMilliseconds
				)
			}
		})
	}
})
