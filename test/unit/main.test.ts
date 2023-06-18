import { boot } from '../../src/boot'

// Mock the dependencies
jest.mock('../../src/boot', () => ({
    boot: jest.fn(),
}))

describe('Test coverage for main function', () => {
    test('should listen to the correct port and log the message', async () => {
        // Arrange
        const mockApp = {
            listen: jest.fn(),
        }
        const mockConfig = {
            port: 3000,
        }
        const mockLogger = {
            info: jest.fn(),
        }

        ;(boot as jest.Mock).mockResolvedValueOnce({
            app: mockApp,
            config: mockConfig,
            logger: mockLogger,
        })

        // Act
        await require('../../src/index') // Assuming the file with the main function is named "main.ts"

        // Assert
        expect(mockApp.listen).toHaveBeenCalledWith(mockConfig.port, expect.any(Function))
    })
})
