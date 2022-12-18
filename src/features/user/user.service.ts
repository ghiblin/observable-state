import { Observable, Subscriber } from "rxjs";
import { Status, Statuses } from "../../lib/helpers";
import { UserDTO } from "./user.dto";
import { UserRepo } from "./user.repo";

// type UserServiceStatus = {
//   user?: UserDTO;
//   status: Statuses;
//   error?: string;
// }

type UserServiceStatus = {
  status: typeof Status.Success;
  user: UserDTO;
} | {
  status: typeof Status.Loading;
} | {
  status: typeof Status.Error;
  error: string
}

export class UserService {
  observers: Subscriber<UserServiceStatus>[] =[]
  state: UserServiceStatus = {
    status: Status.Loading
  }
  observable: Observable<UserServiceStatus>;
  repo = new UserRepo();

  constructor() {
    this.observable = new Observable<UserServiceStatus>((observer) => {
      this.observers.push(observer);
      observer.next(this.state)
      return () => {
        this.observers = this.observers.filter((obs) => obs !== observer)
      }
    })
  }

  private write(state: UserServiceStatus): void {
    this.state = state;
    this.observers.forEach((observer) => {
      if (observer && observer.next) {
        observer.next(state)
      }
    })
  }
  
  getUser(): Observable<UserServiceStatus> {
    const shouldUpdate = !this.observers.length
    if (shouldUpdate) {
      this.write({
        ...this.state,
        status: Status.Loading
      })
      this.repo.getUser().then((user) => {
        this.write({
          status: Status.Success,
          user,
        })
      }).catch((e) => {
        this.write({
          error:e.message,
          status: Status.Error,
        })
      })
    }

    return this.observable
  }

  async updateUser(user: UserDTO): Promise<void> {
    // Optimistic update
    this.write({
      ...this.state,
      status: Status.Success,
      user,
    })
    await this.repo.updateUser(user);
    // handle errors and roll back the update user data on error
  }
}