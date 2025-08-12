import e from "cors";
import { UserAuthInterface } from "../../domain/interfaces/Auth.interface";

export class AuthService {
  users: UserAuthInterface[] = [
    {
      id: "1",
      username: "alice",
      token: "alice-token",
      password: "123456",
    },
    {
      id: "2",
      username: "bob",
      token: "bob-token",
      password: "123456",
    },
    {
      id: "3",
      username: "charlie",
      token: "charlie-token",
      password: "123456",
    },
  ];

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
