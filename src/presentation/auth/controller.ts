import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(public authService = new AuthService()) {} // private readonly ticketService = new TicketService(),

  public isUserAuthenticated = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = this.authService.isUserAuthenticated(username, password);

    if (user !== null)
      return res.status(201).json({
        user: user,
        authorized: true,
      });
    return res.status(401).json({
      authorized: false,
    });
  };
}
