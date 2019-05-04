import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'
import { Context } from './utils'
import datamodelInfo from './generated/nexus-prisma'
import * as path from 'path'
import { intArg, arg, asNexusMethod } from 'nexus'
import { prismaObjectType, makePrismaSchema } from 'nexus-prisma'
import * as moment from 'moment'

const Query = prismaObjectType({
  name: 'Query',
  definition: t => {
    t.prismaFields(['*'])
    t.field('activeTimelog', {
      type: 'Timelog',
      nullable: true,
      resolve: (root, args, { prisma }) =>
        prisma.timelogs({ where: { finishDate: null } }).then(t => t[0])
    })
  }
})

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition: t => {
    t.prismaFields(['*'])
    t.field('completeTask', {
      type: 'Task',
      args: { where: arg({ type: 'TaskWhereUniqueInput', nullable: false }) },
      resolve: async (root, { where }, { prisma }) => {
        const task = await prisma.task({ id: where.id })
        return prisma.updateTask({
          data: {
            completed: !task.completed,
            finishDate: task.finishDate ? null : moment().format()
          },
          where
        })
      }
    })
    t.field('stopTimelog', {
      type: 'Timelog',
      args: {
        where: arg({ type: 'TimelogWhereUniqueInput', nullable: false })
      },
      resolve: (root, { where }, { prisma }) =>
        prisma.updateTimelog({
          data: { finishDate: moment().format() },
          where
        })
    })
  }
})

const Task = prismaObjectType({
  name: 'Task',
  definition: t => {
    t.prismaFields(['*'])
    t.field('project', {
      type: 'Project',
      nullable: true,
      resolve: (root, args, ctx) =>
        ctx.prisma
          .task({ id: root.id })
          .subproject()
          .project()
    })
    t.string('statusTime', {
      nullable: true,
      resolve: async (root, args, { prisma }) => {
        const timelogs = await prisma.task({ id: root.id }).timelogs()

        const duration = timelogs.reduce(
          (acc, curr) =>
            acc.add(moment(curr.finishDate).diff(moment(curr.startDate))),
          moment.duration(0)
        )

        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
      }
    })
  }
})

const Project = prismaObjectType({
  name: 'Project',
  definition: t => {
    t.prismaFields(['*'])
    t.field('estimateTime', {
      type: 'String',
      resolve: (root, args, { prisma }) => '05:05:05'
    })
    t.field('statusTime', {
      type: 'String',
      resolve: () => '05:05:05'
    })
  }
})

const Subproject = prismaObjectType({
  name: 'Subproject',
  definition: t => {
    t.prismaFields(['*'])
    t.field('estimateTime', {
      type: 'String',
      resolve: async (root, args, { prisma }) => {
        const tasks = await prisma.subproject({ id: root.id }).tasks()

        const estimateTime = tasks.reduce(
          (acc, curr) => acc.add(moment.duration(curr.estimateTime)),
          moment.duration(0)
        )

        return moment.utc(estimateTime.as('milliseconds')).format('HH:mm:ss')
      }
    })
    t.field('statusTime', {
      type: 'String',
      resolve: async (root, args, { prisma }) => {
        const timelogs = await prisma
          .subproject({ id: root.id })
          .tasks()
          .then(tasks =>
            tasks.reduce((acc, curr) => [...acc, ...curr.timelogs()], [])
          )

        const duration = timelogs.reduce(
          (acc, curr) =>
            acc.add(moment(curr.finishDate).diff(moment(curr.startDate))),
          moment.duration(0)
        )

        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
      }
    })
  }
})

const schema = makePrismaSchema({
  types: [Query, Mutation, Task, Project, Subproject],

  prisma: {
    datamodelInfo,
    client: prisma
  },

  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts')
  }
})
const server = new GraphQLServer({
  schema,
  context: { prisma }
})
server.start(() => console.log('Server is running on http://localhost:4000'))
