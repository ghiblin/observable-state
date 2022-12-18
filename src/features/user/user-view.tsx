import { useMemo } from "react";
import { Status } from "../../lib/helpers";
import LoadingIndicator from "../../loading-indicator";
import { UserService } from "./user.service";
import useUserService from "./useUserService";

export default function UserView() {
  const userService = useMemo(() => {
    return new UserService()
  }, [])
  
  const {user, status, update} = useUserService(userService)

  if (status === Status.Loading) {
    return <LoadingIndicator />
  }

  if (status === Status.Error) {
    return <p>Failed to load user.</p>
  }

  return (
    <article>
      <div>{user?.name}</div>
      <button onClick={() => update(user!)}>Save</button>
    </article>
  )
}