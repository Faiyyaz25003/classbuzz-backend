import express from "express";
import {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
    verifyGameAccess,
    getGamesForUser,
    assignUsersToGame,
} from "../Controller/gameController.js";

const router = express.Router();

// Static routes PEHLE (dynamic se pehle honi chahiye)
router.post("/create", createGame);
router.get("/all", getAllGames);
router.post("/assign-users", assignUsersToGame);
router.post("/verify-access", verifyGameAccess);
router.get("/user/:email", getGamesForUser);

// Dynamic routes BAAD MEIN
router.get("/:id", getGameById);
router.put("/update/:id", updateGame);
router.delete("/delete/:id", deleteGame);

export default router;