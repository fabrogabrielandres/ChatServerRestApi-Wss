import { UserAuthInterface } from "../users/model";
import { getUsers } from "../users/service";

export class AuthService {
  constructor(private users: UserAuthInterface[] = []) {
    this.users = getUsers();
  }

  public isUserAuthenticated(
    username: string,
    password: string
  ): Partial<UserAuthInterface> | null {
    console.log("llego aca", username, password);

    const user: UserAuthInterface[] = this.users.filter(
      (user) => user.username === username && user.password === password
    );
    if (user.length > 0) {
      const { password: passUser, ...userWithoutPass } = user[0];
      return user ? userWithoutPass : null;
    } else {
      return null;
    }
  }
}
