import { AuthInterface } from "../../domain/interfaces/Auth.interface";

export class AuthService {
  users: AuthInterface[] = [
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
  ): Partial<AuthInterface> | null {
    const user: AuthInterface[] = this.users.filter(
      (user) => user.username === username && user.password === password
    );
    const { password: passUser, ...userWithoutPass } = user[0];
    return user ? userWithoutPass : null;
  }
}
