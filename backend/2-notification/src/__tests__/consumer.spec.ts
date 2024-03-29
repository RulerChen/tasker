import { jest } from '@jest/globals';
import * as connection from '@/queues/connect';
import { consumeAuthEmailMessages } from '@/queues/consumer';

jest.mock('@/queues/connect');
jest.mock('@rulerchen/tasker-shared-library');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages method', () => {
    test('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);

      const connectionChannel = await connection.createConnection();
      await consumeAuthEmailMessages(connectionChannel!);

      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('tasker-email-notifications', 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'tasker-email-notifications', 'auth-email');
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
    });
  });
});
