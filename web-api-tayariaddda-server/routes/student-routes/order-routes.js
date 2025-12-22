const express = require("express");
const {
  createOrder,
  createKhaltiOrder,
  capturePaymentAndFinalizeOrder,
  verifyPayment,
  initiateKhaltiPayment,
  createEsewaOrder,
  verifyEsewaPayment
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/create-khalti", createKhaltiOrder);
router.post("/verify-payment", verifyPayment);
router.post("/capture", capturePaymentAndFinalizeOrder);
router.post("/initiate-payment", initiateKhaltiPayment);
router.post("/create-esewa", createEsewaOrder);
router.post("/verify-esewa", verifyEsewaPayment);

module.exports = router;
