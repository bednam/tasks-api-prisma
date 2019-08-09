import { aggregateTime, aggregateTimeDiff, getCurrentDateTime } from '../utils/'

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

		return aggregateTimeDiff(timelogs, t => t.startDate, t => t.finishDate)
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
				finishDate: task.finishDate ? null : getCurrentDateTime()
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
