import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()

export class RedisCacheService {
	constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
        ){}
        
	async get(key: string): Promise<string> {
		const savedTime = await this.cacheManager.get<number>(key);
        if(savedTime){
            return `saved time: ${savedTime}`;
        }
        const currentTime = new Date().getTime();
        await this.cacheManager.set(key, currentTime);
        return `current time: ${currentTime}`;
	}
	
	async set(key: string, value: string, expireTime?: number): Promise<'OK' | void> {
		return this.cacheManager.set(key, value, expireTime ?? 10);
	}
	
	async del(key: string): Promise<number| void> {
		return this.cacheManager.del(key);
	}
}
export default RedisCacheService;