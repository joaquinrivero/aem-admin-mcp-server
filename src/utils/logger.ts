type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class Logger {
  private logLevel: LogLevel = 'info';

  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };

    const output = context
      ? `[${entry.timestamp}] ${level.toUpperCase()}: ${message} ${JSON.stringify(context)}`
      : `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`;

    console.log(output);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }
}

export const logger = new Logger();