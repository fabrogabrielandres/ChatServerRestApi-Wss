import { Router } from "express";
import { AuthController } from "./controller";

export class AuthRouters {
  static get routes() {
    const router = Router();
    const authController = new AuthController();

    router.get("/", authController.getTickets);

    return router;
  }
}
