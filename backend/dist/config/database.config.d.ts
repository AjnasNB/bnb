export declare const databaseConfig: (() => {
    type: string;
    path: string;
    synchronize: boolean;
    logging: boolean;
    migrations: string[];
    migrationsRun: boolean;
    entities: string[];
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    type: string;
    path: string;
    synchronize: boolean;
    logging: boolean;
    migrations: string[];
    migrationsRun: boolean;
    entities: string[];
}>;
