require('newrelic')
import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'
import { Context } from './types'
import datamodelInfo from './generated/nexus-prisma'
import * as path from 'path'
import { makePrismaSchema } from 'nexus-prisma'
import * as moment from 'moment'
import * as types from './resolvers'
import { permissions } from './permissions/'

const schema = makePrismaSchema({
  types,
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
  middlewares: [permissions],
  context: request => ({ ...request, prisma })
})
server.start(() => console.log('Server is running on http://localhost:4000'))
