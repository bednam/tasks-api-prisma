import * as moment from 'moment'

export const dateToTime = date =>
	moment.utc(date.as('milliseconds')).format('HH:mm:ss')

/**
	@return aggregated duration of specific property of items
	@param items array of elements containing property to aggregate
	@param extractTime function which takes single element from items array and returns its property used for aggregation
*/
export const aggregateTime = (items, extractTime) =>
	dateToTime(
		items.reduce(
			(acc, curr) => acc.add(moment.duration(extractTime(curr))),
			moment.duration(0)
		)
	)

/**
	@return aggregated duration of specific differences of item properties
	@param items array of elements containing two properties which difference is to aggregate
	@param extractStart function which takes single element from items array and returns its property used for aggregation
	@param extractEnd function which takes single element from items array and returns its property used for aggregation
*/
export const aggregateTimeDiff = (items, extractStart, extractEnd) =>
	dateToTime(
		items.reduce(
			(acc, curr) =>
				acc.add(
					moment(extractEnd(curr)).diff(moment(extractStart(curr)))
				),
			moment.duration(0)
		)
	)

export const getCurrentDateTime = () => moment().format()
