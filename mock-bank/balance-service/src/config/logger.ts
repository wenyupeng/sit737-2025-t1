import * as winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
        // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

logger.info('Starting application...');

export const logInfo = (message: string, ...args: any[]) => {
    logger.info(message, ...args);
};

export const logError = (message: string, ...args: any[]) => {
    logger.error(message, ...args);
};

// Example usage:
// logInfo('Request received:', { method: req.method, url: req.url });
// res.status(200).json({ message: 'Hello from the logger!' });