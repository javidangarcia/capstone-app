import express from "express";
import { Stock } from "../models/stock.js";
import { Follow } from "../models/follow.js";
import { Like } from "../models/like.js";
import { Dislike } from "../models/dislike.js";

const router = express.Router();

router.get("/stocks", async (req, res) => {
    try {
        const stocks = await Stock.findAll();

        if (stocks.length === 0) {
            res.status(404).json({
                error: "There are no stocks in the database."
            });
            return;
        }

        res.status(200).json({ stocks });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Create a new stock in database
router.post("/stock", async (req, res) => {
    const { ticker } = req.body;

    try {
        const stock = await Stock.findOne({
            where: { ticker }
        });

        if (stock !== null) {
            res.status(409).json({
                error: "This stock already exists in the database."
            });
            return;
        }

        const newStock = await Stock.create(req.body);
        res.status(200).json({ stock: newStock });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Get a specific stock from database
router.get("/stock/:ticker", async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    const { user } = req.session;

    try {
        const stock = await Stock.findOne({
            where: { ticker }
        });

        if (stock === null) {
            res.status(404).json({
                error: "This stock does not exist in database."
            });
            return;
        }

        const StockId = stock.id;
        const UserId = user.id;

        const [following, liking, disliking] = await Promise.all([
            Follow.findOne({ where: { UserId, StockId } }),
            Like.findOne({ where: { UserId, StockId } }),
            Dislike.findOne({ where: { UserId, StockId } })
        ]);

        const currentStock = {
            ...stock.dataValues,
            following: following != null,
            liking: liking != null,
            disliking: disliking != null
        };

        res.status(200).json({ stock: currentStock });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
