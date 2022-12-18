import { useEffect, useState } from "react";
import { Status, Statuses } from "../../lib/helpers";
import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";

const useUserService = (userService: UserService) => {
  const [user, setUser] = useState<UserDTO | null>(null)
  const [status, setStatus] = useState<Statuses>(Status.Loading)

  const update = (newValue: UserDTO) => userService.updateUser(newValue)

  useEffect(() => {
    const observable = userService.getUser();
    const subscription = observable.subscribe((state) => {
      switch(state.status) {
        case Status.Success:
          setUser(state.user!)
          setStatus(Status.Success);
          break;

        case Status.Error:
        setUser(null)
        setStatus(Status.Error)
        break;

        case Status.Loading:
          setUser(null);
          setStatus(Status.Loading);
      } 
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {user, status, update}
}

export default useUserService