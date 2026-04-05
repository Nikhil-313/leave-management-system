const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Leave = require("../models/Leave");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const { protect, adminOnly } = require("../middleware/authMiddleware");


// ================= APPLY LEAVE =================
router.post("/apply", protect, async (req, res) => {
  try {
    const { fromDate, toDate, reason, leaveType } = req.body;
    const user = await User.findById(req.user.id);

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const days =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (user.remainingCL < days) {
      return res
        .status(400)
        .json({ message: "Not enough leave balance" });
    }

    const leave = new Leave({
      userId: req.user.id,
      fromDate,
      toDate,
      days,
      reason,
      leaveType
    });

    await leave.save();

    user.remainingCL -= days;
    await user.save();

    res.json({ message: "Leave applied successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET HISTORY =================
router.get("/history", protect, async (req, res) => {
  try {
    const leaves = await Leave.find({
      userId: req.user.id
    });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// ================= GET BALANCE =================
router.get("/balance", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ remainingCL: user.remainingCL });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= ADMIN ROUTES =================
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const leaves = await Leave.find().populate("userId");
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/status/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leave.findById(req.params.id);
    leave.status = status;
    await leave.save();

    res.json({ message: "Status updated" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= EXPORT EXCEL =================
router.get("/export/excel", protect, async (req, res) => {
  try {
    const leaves = await Leave.find({
      userId: req.user.id
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Leaves");

    sheet.columns = [
      { header: "From", key: "fromDate" },
      { header: "To", key: "toDate" },
      { header: "Days", key: "days" },
      { header: "Status", key: "status" }
    ];

    leaves.forEach(l => {
      sheet.addRow({
        fromDate: l.fromDate.toDateString(),
        toDate: l.toDate.toDateString(),
        days: l.days,
        status: l.status
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=leaves.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= EXPORT PDF =================
router.get("/export/pdf", protect, async (req, res) => {
  try {
    const leaves = await Leave.find({
      userId: req.user.id
    });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=leaves.pdf"
    );

    doc.pipe(res);

    doc.fontSize(18).text("Leave History", { align: "center" });
    doc.moveDown();

    leaves.forEach(l => {
      doc.text(
        `From: ${l.fromDate.toDateString()} | To: ${l.toDate.toDateString()} | Days: ${l.days} | Status: ${l.status}`
      );
    });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN STATS =================
router.get("/admin/stats", protect, adminOnly, async (req, res) => {
  try {
    const total = await Leave.countDocuments();
    const pending = await Leave.countDocuments({ status: "Pending" });
    const approved = await Leave.countDocuments({ status: "Approved" });
    const rejected = await Leave.countDocuments({ status: "Rejected" });

    res.json({
      total,
      pending,
      approved,
      rejected
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/stats", protect, async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user.id });

    const stats = {
      total: leaves.length,
      approved: leaves.filter(l => l.status === "Approved").length,
      pending: leaves.filter(l => l.status === "Pending").length,
      rejected: leaves.filter(l => l.status === "Rejected").length
    };

    res.json(stats);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;