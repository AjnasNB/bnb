import { HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
export declare class HealthController {
    private health;
    private http;
    private db;
    private memory;
    private disk;
    private configService;
    constructor(health: HealthCheckService, http: HttpHealthIndicator, db: TypeOrmHealthIndicator, memory: MemoryHealthIndicator, disk: DiskHealthIndicator, configService: ConfigService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    simple(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
    };
}
