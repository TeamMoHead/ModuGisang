import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRedis  } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()

export class RedisCacheService {
	private client;
	constructor(
		@InjectRedis() private readonly redis: Redis,
	) {}
	async get(key: string): Promise<string> {
		return await this.redis.get(key);
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		await this.redis.set(key, value, 'EX', ttl ?? 100000);
	}

	async lastVisitedTimeGet(key: string): Promise<string> {
		const savedTime = await this.redis.get(key);
		if (savedTime) {
			return `saved time: ${savedTime}`;
		}
		const currentTime = new Date().getTime();
		await this.redis.set(key, currentTime);
		return `current time: ${currentTime}`;
	}
	async del(key: string): Promise<number> {
		return await this.redis.del(key);
	}
	
	// async get(key: string): Promise<any> {
	// 	return this.cacheManager.get(key);
	// }


	// async set(key: string, value: any, ttl?: number): Promise<'OK' | void> {
	// 	console.log(`Setting TTL for ${key} to ${ttl ?? 100} seconds.`);
	// 	return await this.cacheManager.set(key, value, 100);
	// }

	// async del(key: string): Promise<number | void> {
	// 	return this.cacheManager.del(key);
	// }
}
export default RedisCacheService;