import { aggregateTimeDiff, dateToMilliseconds } from '../utils/'

class TagRepository {
	public getStatusTime = async (root, { timelogs_every }, context) => {
		const timelogs = await this.getTimelogsByTag(
			root.id,
			timelogs_every,
			context
		)

		return aggregateTimeDiff(timelogs, t => t.startDate, t => t.finishDate)
	}

	public getStatusMs = async (root, { timelogs_every }, context) => {
		const timelogs = await this.getTimelogsByTag(
			root.id,
			timelogs_every,
			context
		)

		return aggregateTimeDiff(
			timelogs,
			t => t.startDate,
			t => t.finishDate,
			dateToMilliseconds
		)
	}

	private getTaskIdsByTag = (id, context) =>
		context.prisma
			.tag({ id })
			.tasks()
			.then(tasks => tasks.map(({ id }) => id))

	private getTimelogsByTasks = (taskIds, args, context) =>
		context.prisma.timelogs({
			where: { task: { id_in: taskIds }, ...args }
		})

	private getTimelogsByTag = async (id, args, context) => {
		const taskIds = await this.getTaskIdsByTag(id, context)

		return this.getTimelogsByTasks(taskIds, args, context)
	}
}

export default new TagRepository()
