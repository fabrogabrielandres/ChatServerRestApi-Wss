import { Router } from "express";
import { AuthController } from "./controller";

export class AuthRouters {
  static get routes() {
    const router = Router();
    const authController = new AuthController();

    router.post("/", authController.isUserAuthenticated);

    return router;
  }
}
