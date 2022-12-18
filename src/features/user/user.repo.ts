import { UserDTO } from "./user.dto";

export class UserRepo {
  getUser(): Promise<UserDTO> {
    return new Promise((resolve) => {
      setTimeout(function () {
        resolve({
          id: '1',
          name: 'user-1'
        })
      }, 500)
    })
  }

  updateUser(data: UserDTO): Promise<UserDTO> {
    return new Promise((resolve) => {
      setTimeout(function() {
        resolve(data)
      }, 500)
    })
  }
}