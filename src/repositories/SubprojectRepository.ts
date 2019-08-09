import { aggregateTime, aggregateTimeDiff } from '../utils/'

class SubprojectRepository {
	async getEstimateTime(id, { prisma }) {
		const tasks = await prisma.subproject({ id }).tasks()

		return aggregateTime(tasks, t => t.estimateTime)
	}

	async getStatusTime(id, { prisma }) {
		const timelogs = await prisma
			.subproject({ id })
			.tasks()
			.then(tasks =>
				tasks.reduce((acc, curr) => [...acc, ...curr.timelogs()], [])
			)

		return aggregateTimeDiff(timelogs, t => t.startDate, t => t.finishDate)
	}
}

export default new SubprojectRepository()
