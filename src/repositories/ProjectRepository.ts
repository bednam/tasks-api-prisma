import * as moment from 'moment'
import { dateToTime } from '../utils/'

class ProjectRepository {
	async getEstimateTime(id, { prisma }) {
		const subprojects = await prisma.project({ id }).subprojects()

		const OR = subprojects.map(({ id }) => ({ subproject: { id } }))

		const tasks = await prisma.tasks({
			where: {
				OR
			}
		})

		const estimateTime = tasks.reduce(
			(acc, curr) => acc.add(moment.duration(curr.estimateTime)),
			moment.duration(0)
		)

		return dateToTime(estimateTime)
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

		const statusTime = timelogs.reduce(
			(acc, curr) =>
				acc.add(moment(curr.finishDate).diff(moment(curr.startDate))),
			moment.duration(0)
		)

		return dateToTime(statusTime)
	}
}

export default new ProjectRepository()
