import axios from 'axios'

const url = 'http://localhost:4000'

const createTimelog = async (startDate: String, finishDate: String) =>
	await axios.post(url, {
		query: `
			mutation {
			  createTimelog(data: { startDate: "${startDate}", finishDate: "${finishDate}", task: { create: { name: "No. 1" } } }) {
			    id
			  }
			}
		`
	})

describe('Query Resolvers', () => {
	it('should add timelog with finishDate', async () => {
		const response = await axios.post(url, {
			query: `
				mutation {
				  createTimelog(data: { startDate: "2018-01-01T01:00:00", finishDate: "2018-01-01T02:00:00", task: { create: { name: "No. 1" } } }) {
				    id
				  }
				}
			`
		})

		expect(response.data).toEqual({ data: { createTimelog: { id: 1 } } })
	})

	it('should add timelog without finishDate', async () => {
		const response = await axios.post(url, {
			query: `
				mutation {
				  createTimelog(data: { startDate: "2018-01-01T01:00:00", task: { create: { name: "No. 1" } } }) {
				    id
				  }
				}
			`
		})

		expect(response.data).toEqual({ data: { createTimelog: { id: 2 } } })
	})

	it('should return active timelog', async () => {
		const response = await axios.post(url, {
			query: `
				query {
					activeTimelog {
						finishDate
					}
				}
			`
		})

		expect(response.data).toMatchObject({
			data: {
				activeTimelog: {
					finishDate: null
				}
			}
		})
	})
})
