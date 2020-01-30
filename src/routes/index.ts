import { Router } from "express";

export const router = Router();
// console.error('called index Router 1');
router.get("/", (req, res, next) => 
  { 
    res.render("index", { title: "Soccer Player Timeline β" })
  }
);
