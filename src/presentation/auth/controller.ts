import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  
  constructor(public authService = new AuthService()) {} // private readonly ticketService = new TicketService(),

  public getTickets = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = this.authService.isUserAuthenticated(username, password);

    if (user)
      return res.status(201).json({
        user: user.username,
        token: user.token,
      });
    return res.status(401).json(null);
  };
}
