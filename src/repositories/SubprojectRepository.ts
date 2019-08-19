import { aggregateTime, aggregateTimeDiff } from '../utils/'

class SubprojectRepository {
	async getEstimateTime(id, { prisma }) {
		const tasks = await prisma.subproject({ id }).tasks()

		return aggregateTime(tasks, t => t.estimateTime)
	}

	async getStatusTime(id, { prisma }) {
		const taskIds = await prisma
			.subproject({ id })
			.tasks()
			.then(tasks => tasks.map(({ id }) => id))

		const timelogs = await prisma.timelogs({
			where: { task: { id_in: taskIds } }
		})

		return aggregateTimeDiff(timelogs, t => t.startDate, t => t.finishDate)
	}
}

export default new SubprojectRepository()
