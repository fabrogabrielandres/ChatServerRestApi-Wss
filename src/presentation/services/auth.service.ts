import { AuthInterface } from "../../domain/interfaces/Auth.interface";

export class AuthService {
  users: AuthInterface[] = [
    {
      username: "alice",
      token: "alice-token",
      password: "123456",
    },
    {
      username: "bob",
      token: "bob-token",
      password: "123456",
    },
    {
      username: "charlie",
      token: "charlie-token",
      password: "123456",
    },
  ];

  public isUserAuthenticated(
    username: string,
    password: string
  ): AuthInterface | null {
    const user = this.users.filter(
      (user) => user.username === username && user.password === password
    );
    return user ? user[0] : null;
  }
}
