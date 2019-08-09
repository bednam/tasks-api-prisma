import { hash, compare } from 'bcrypt'
import { APP_SECRET, getUserId } from '../utils'
import { sign } from 'jsonwebtoken'

class UserRepository {
	async login({ email, password }, context) {
		const user = await context.prisma.user({ email })
		if (!user) {
			throw new Error(`No user found for email: ${email}`)
		}
		const passwordValid = await compare(password, user.password)
		if (!passwordValid) {
			throw new Error('Invalid password')
		}

		return {
			token: sign({ userId: user.id }, APP_SECRET),
			user
		}
	}
}

export default new UserRepository()
