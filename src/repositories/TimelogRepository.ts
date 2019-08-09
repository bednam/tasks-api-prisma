import { getCurrentDateTime } from '../utils/'
import { getUserId } from '../utils'

class TimelogRepository {
	async getActiveTimelog(context) {
		const userId = getUserId(context)

		const activeTimelog = await context.prisma
			.timelogs({
				where: { finishDate: null, task: { user: { id: userId } } }
			})
			.then(t => t[0])

		return activeTimelog
	}

	async startTimelog(data, context) {
		const activeTimelog = await this.getActiveTimelog(context)

		// stop pending timelog
		if (activeTimelog) {
			await this.stopTimelog(activeTimelog.id, context)
		}

		return context.prisma.createTimelog({
			startDate: getCurrentDateTime(),
			...data
		})
	}

	async stopTimelog(id, { prisma }) {
		const timelog = await prisma.updateTimelog({
			data: { finishDate: getCurrentDateTime() },
			where: { id }
		})

		return timelog
	}
}

export default new TimelogRepository()
