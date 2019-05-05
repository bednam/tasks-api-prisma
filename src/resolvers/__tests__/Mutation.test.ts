import axios from 'axios'

const url = 'http://localhost:4000'

describe('Query Mutations', () => {
	it('should add timelog with startDate on startTimelog', async () => {
		const response = await axios.post(url, {
			query: `
				mutation {
					startTimelog(data: { task: { create: { name: "Task for startTimelog" } } }) {
						startDate
						task {
							name
						}
					}
				}
			`
		})

		expect(response.data).toMatchObject({
			data: {
				startTimelog: {
					startDate: expect.anything(),
					task: { name: 'Task for startTimelog' }
				}
			}
		})
	})
})
