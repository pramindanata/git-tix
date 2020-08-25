const connectionStr = 'connection'
const clientStr = 'client'

function createPubMock() {
  return {
    publish: jest.fn(),
  }
}

export const stan = {
  connect: jest.fn().mockResolvedValue(connectionStr),
  getInstance: jest.fn().mockReturnValue(clientStr),
  getPubs: jest.fn().mockReturnValue({
    paymentCreatedPub: createPubMock(),
  }),
}
