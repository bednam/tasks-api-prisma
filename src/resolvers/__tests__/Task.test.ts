import axios from 'axios'

const url = 'http://localhost:4000'

describe('Task Resolvers', () => {
	it('should resolve project without intermediate subproject relationship', async () => {
		const response1 = await axios.post(url, {
			query: `
			mutation {
				createTask(data: { name: "No. 1", subproject: { create: { name: "No. 1", project: { create: { name: "No. 1" } }}}}) {
			    id
			    name
			  }
			}
			`
		})

		const response2 = await axios.post(url, {
			query: `
			query {
				task(where: { id: 1 }) {
					project {
						name
					}
				}
			}
			`
		})

		expect(response1.data).toMatchObject({
			data: { createTask: { id: 1, name: 'No. 1' } }
		})
		expect(response2.data).toMatchObject({
			data: { task: { project: { name: 'No. 1' } } }
		})
	})
})
