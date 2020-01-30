import { Router } from "express";
import { Team } from "../models/Team";

export const router = Router();

router.get("/", (req, res, next) => 
  { 
    res.render("search", { title: "Soccer Player Timeline β",teamList:Team.getNameList() });
  }
);


