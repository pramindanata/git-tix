import { UserDocument } from '../../models/user'

interface UserDTO {
  id: string
  email: string
}

export class UserMapper {
  static toDTO(user: UserDocument): UserDTO {
    return {
      id: user.id,
      email: user.email,
    }
  }
}
