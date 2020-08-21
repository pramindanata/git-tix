const connectionStr = 'connection'
const clientStr = 'client'

export const stan = {
  connect: jest.fn().mockResolvedValue(connectionStr),
  getInstance: jest.fn().mockReturnValue(clientStr),
}
