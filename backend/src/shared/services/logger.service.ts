import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * LoggerService provides structured JSON logging capabilities.
 * Implements NestJS LoggerService interface for integration with the framework.
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  /**
   * Logs a debug message.
   */
  debug(message: string, context?: string) {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Logs an info message.
   */
  log(message: string, context?: string): void;
  log(level: LogLevel, message: string, context?: string): void;
  log(messageOrLevel: string | LogLevel, messageOrContext?: string, context?: string) {
    if (
      typeof messageOrLevel === 'string' &&
      !Object.values(LogLevel).includes(messageOrLevel as LogLevel)
    ) {
      // First signature: log(message, context)
      this.writeLog(LogLevel.INFO, messageOrLevel, messageOrContext);
    } else {
      // Second signature: log(level, message, context)
      this.writeLog(messageOrLevel as LogLevel, messageOrContext || '', context);
    }
  }

  /**
   * Logs a warning message.
   */
  warn(message: string, context?: string) {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Logs an error message.
   */
  error(message: string, trace?: string, context?: string) {
    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      context: context || this.context,
      timestamp: new Date().toISOString(),
    };

    if (trace) {
      entry.trace = trace;
    }

    this.output(entry);
  }

  /**
   * Logs a verbose message (alias for debug).
   */
  verbose(message: string, context?: string) {
    this.debug(message, context);
  }

  private writeLog(level: LogLevel, message: string, context?: string) {
    const entry: LogEntry = {
      level,
      message,
      context: context || this.context,
      timestamp: new Date().toISOString(),
    };

    this.output(entry);
  }

  private output(entry: LogEntry) {
    const jsonLog = JSON.stringify(entry);

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(jsonLog);
        break;
      case LogLevel.WARN:
        console.warn(jsonLog);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(jsonLog);
    }
  }
}
