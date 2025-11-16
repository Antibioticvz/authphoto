import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService, LogLevel } from '../logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);

    // Spy on console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should log info messages', () => {
      service.log('Test message');
      expect(consoleLogSpy).toHaveBeenCalled();

      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(loggedData.level).toBe(LogLevel.INFO);
      expect(loggedData.message).toBe('Test message');
      expect(loggedData.timestamp).toBeDefined();
    });

    it('should include context in log', () => {
      service.log('Test message', 'TestContext');

      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(loggedData.context).toBe('TestContext');
    });

    it('should use set context', () => {
      service.setContext('GlobalContext');
      service.log('Test message');

      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(loggedData.context).toBe('GlobalContext');
    });
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      service.debug('Debug message');

      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(loggedData.level).toBe(LogLevel.DEBUG);
      expect(loggedData.message).toBe('Debug message');
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      service.warn('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][0]);
      expect(loggedData.level).toBe(LogLevel.WARN);
      expect(loggedData.message).toBe('Warning message');
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      service.error('Error message');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(loggedData.level).toBe(LogLevel.ERROR);
      expect(loggedData.message).toBe('Error message');
    });

    it('should include stack trace', () => {
      service.error('Error message', 'Stack trace');

      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(loggedData.trace).toBe('Stack trace');
    });
  });

  describe('verbose', () => {
    it('should log verbose messages as debug', () => {
      service.verbose('Verbose message');

      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(loggedData.level).toBe(LogLevel.DEBUG);
      expect(loggedData.message).toBe('Verbose message');
    });
  });

  describe('structured logging', () => {
    it('should output valid JSON', () => {
      service.log('Test');

      const output = consoleLogSpy.mock.calls[0][0];
      expect(() => JSON.parse(output)).not.toThrow();
    });

    it('should include timestamp in ISO format', () => {
      service.log('Test');

      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(loggedData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});
