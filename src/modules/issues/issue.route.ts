import { Router } from "express";
import protectedAuth from "../../middleware/auth.protected";
import { issuesController } from "./issue.controller";
import { USER_ROLE } from "../../types/express.types";

const router = Router()

router.post("/", protectedAuth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssue)
router.get("/", issuesController.getAllIssues)
router.get("/:id", issuesController.getSingleIssue)
router.patch("/:id", protectedAuth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.updateIssue)
router.delete("/:id", protectedAuth(USER_ROLE.maintainer), issuesController.deleteIssue)

export const issuesRoute = router