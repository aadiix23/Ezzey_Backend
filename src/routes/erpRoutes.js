const express = require("express");
const router = express.Router();

const {
  connectERP,
  syncERP,
  syncStatus
} = require("../controllers/erpController");

router.post("/connect", connectERP);
router.get("/sync", syncERP);
router.get("/status", syncStatus);

module.exports = router;
