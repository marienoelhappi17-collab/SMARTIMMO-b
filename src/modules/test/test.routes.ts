import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

const router = Router();

router.get("/bailleur", authenticate, authorize("BAILLEUR"), (req, res) => {
  res.json({ success: true, message: "Zone réservée au bailleur", data: req.user });
});

router.get("/locataire", authenticate, authorize("LOCATAIRE"), (req, res) => {
  res.json({ success: true, message: "Zone réservée au locataire", data: req.user });
});

export default router;