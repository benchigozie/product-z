import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const url = config.get<string>('REDIS_URL');
                if (!url) {
                    throw new Error(
                        'REDIS_URL is required to run the queue infrastructure.',
                    );
                }
                const parsed = new URL(url);
                return {
                    connection: {
                        host: parsed.hostname,
                        port: Number(parsed.port || 6379),
                    },
                };
            },
        }),
    ],
    exports: [BullModule],
})
export class QueueRootModule {}