import * as moment from 'moment'

export const dateToTime = date =>
	moment.utc(date.as('milliseconds')).format('HH:mm:ss')
