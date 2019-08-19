import { rule, shield, allow, deny } from 'graphql-shield'
import { getUserId } from '../utils'

const rules = {
  isAuthenticated: rule()((parent, args, context) =>
    Boolean(getUserId(context))
  ),
  isOwner: rule()(
    async (parent, { where: { user } }, context) =>
      getUserId(context) === user.id
  ),
  isOwnerThroughTask: rule()(
    async (parent, { where: { task } }, context) =>
      getUserId(context) === task.user.id
  ),
  isOwnerThroughProject: rule()(
    (parent, { where: { project } }, context) =>
      getUserId(context) === project.user.id
  )
}

/*
  TODO subproject permission not breaking subproject select and new-project
*/
export const permissions = shield({
  Query: {
    '*': rules.isAuthenticated,
    tasks: rules.isOwner,
    timelogs: rules.isOwnerThroughTask,
    projects: rules.isOwner
    // subprojects: rules.isOwnerThroughProject
  },
  Mutation: {
    '*': rules.isAuthenticated,
    login: allow
  }
})
