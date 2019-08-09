import { aggregateTime, aggregateTimeDiff } from '../utils/'

class ProjectRepository {
	async getEstimateTime(id, { prisma }) {
		const subprojects = await prisma.project({ id }).subprojects()

		const OR = subprojects.map(({ id }) => ({ subproject: { id } }))

		const tasks = await prisma.tasks({
			where: {
				OR
			}
		})

		return aggregateTime(tasks, task => task.estimateTime)
	}

	async getStatusTime(id, { prisma }) {
		const subprojects = await prisma.project({ id }).subprojects()

		const tasks = await prisma.tasks({
			where: {
				OR: subprojects.map(({ id }) => ({ subproject: { id } }))
			}
		})

		const timelogs = await prisma.timelogs({
			where: {
				OR: tasks.map(({ id }) => ({ task: { id } }))
			}
		})

		return aggregateTimeDiff(timelogs, t => t.startDate, t => t.finishDate)
	}
}

export default new ProjectRepository()
