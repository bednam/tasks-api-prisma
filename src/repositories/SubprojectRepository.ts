import * as moment from 'moment'

class SubprojectRepository {
	async getEstimateTime(id, { prisma }) {
		const tasks = await prisma.subproject({ id }).tasks()

		const estimateTime = tasks.reduce(
			(acc, curr) => acc.add(moment.duration(curr.estimateTime)),
			moment.duration(0)
		)

		return moment.utc(estimateTime.as('milliseconds')).format('HH:mm:ss')
	}

	async getStatusTime(id, { prisma }) {
		const timelogs = await prisma
			.subproject({ id })
			.tasks()
			.then(tasks =>
				tasks.reduce((acc, curr) => [...acc, ...curr.timelogs()], [])
			)

		const duration = timelogs.reduce(
			(acc, curr) =>
				acc.add(moment(curr.finishDate).diff(moment(curr.startDate))),
			moment.duration(0)
		)

		return moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
	}
}

export default new SubprojectRepository()
