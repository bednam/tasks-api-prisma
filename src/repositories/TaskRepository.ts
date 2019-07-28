import * as moment from 'moment'

class TaskRepository {
	async getProject(id, { prisma }) {
		const project = await prisma
			.task({ id })
			.subproject()
			.project()

		return project
	}

	async getStatusTime(id, { prisma }) {
		const timelogs = await prisma.task({ id }).timelogs()

		const duration = timelogs.reduce(
			(acc, curr) =>
				acc.add(moment(curr.finishDate).diff(moment(curr.startDate))),
			moment.duration(0)
		)
		return moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
	}

	async getLatestTimelogStartDate(id, { prisma }) {
		const [latestTimelog] = await prisma
			.task({ id })
			.timelogs({ orderBy: 'startDate_DESC' })

		return latestTimelog ? latestTimelog.startDate : null
	}

	getTimelogCount(id, { prisma }) {
		return prisma
			.timelogsConnection({ where: { task: { id } } })
			.aggregate()
			.count()
	}

	async completeTask(id, { prisma }) {
		const task = await prisma.task({ id })
		const updatedTask = await prisma.updateTask({
			data: {
				completed: !task.completed,
				finishDate: task.finishDate ? null : moment().format()
			},
			where: { id }
		})

		return updatedTask
	}

	async cloneTask(id, { prisma }) {
		const {
			id: taskId,
			completed,
			finishDate,
			...data
		} = await prisma.task({
			id
		})

		return prisma.createTask(data)
	}
}

export default new TaskRepository()
