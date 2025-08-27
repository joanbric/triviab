import { Redis } from 'ioredis'

declare global {
  var redis: Redis
}

const redis = global.redis || new Redis()

if(process.env.NODE_ENV !== 'production') global.redis = redis

export default redis
