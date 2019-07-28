import * as moment from 'moment'

class TimelogRepository {
	getActiveTimelog({ prisma }) {
		return prisma.timelogs({ where: { finishDate: null } }).then(t => t[0])
	}

	async startTimelog(data, { prisma }) {
		const timelog = await prisma
			.timelogs({ where: { finishDate: null } })
			.then(t => t[0])

		// stop pending timelog
		if (timelog) {
			await this.stopTimelog(timelog.id, { prisma })
		}

		return prisma.createTimelog({
			startDate: moment().format(),
			...data
		})
	}

	async stopTimelog(id, { prisma }) {
		const timelog = await prisma.updateTimelog({
			data: { finishDate: moment().format() },
			where: { id }
		})

		return timelog
	}
}

export default new TimelogRepository()
