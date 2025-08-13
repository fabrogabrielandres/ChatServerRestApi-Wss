import { UserAuthInterface } from "./model";

const users: UserAuthInterface[] = [
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

export const getUsers = () => {
  return users;
};
