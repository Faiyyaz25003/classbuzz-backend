import IssuedBook from "../Models/issuedBookModel.js";
import Book from "../Models/bookModel.js";

// Helper: compute status from endDate
const computeStatus = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return "expired";
  if (daysLeft <= 3) return "expiring";
  return "active";
};

// Helper: add daysLeft to issued record
const withDaysLeft = (issued) => {
  const obj = issued.toObject ? issued.toObject() : issued;
  const now = new Date();
  const end = new Date(obj.endDate);
  obj.daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return obj;
};

// ─── Issue a Book ──────────────────────────────────────────────────
// POST /api/issued
export const issueBook = async (req, res) => {
  try {
    const { bookId, studentName, department, issueDate } = req.body;

    if (!bookId || !studentName || !department || !issueDate) {
      return res.status(400).json({
        success: false,
        message: "bookId, studentName, department, issueDate are required",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const issueDateObj = new Date(issueDate);
    const endDateObj = new Date(issueDateObj);
    endDateObj.setDate(endDateObj.getDate() + 14);

    const status = computeStatus(endDateObj);

    const issued = await IssuedBook.create({
      book: book._id,
      bookName: book.name,
      category: book.category,
      color: book.color,
      bg: book.bg,
      file: book.file,        // ✅ fixed: was pdfFile: book.pdfFile
      studentName,
      department,
      issueDate: issueDateObj,
      endDate: endDateObj,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: withDaysLeft(issued),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Issued Books ──────────────────────────────────────────
// GET /api/issued
export const getAllIssued = async (req, res) => {
  try {
    const { search } = req.query;

    await refreshStatuses();

    const filter = { status: { $ne: "returned" } };

    if (search) {
      filter.$or = [
        { bookName: { $regex: search, $options: "i" } },
        { studentName: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const issued = await IssuedBook.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: issued.length,
      data: issued.map(withDaysLeft),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get My Books ──────────────────────────────────────────────────
// GET /api/issued/my-books
export const getMyBooks = async (req, res) => {
  try {
    await refreshStatuses();

    const myBooks = await IssuedBook.find({
      status: { $in: ["active", "expiring"] },
    }).sort({ endDate: 1 });

    res.json({
      success: true,
      count: myBooks.length,
      data: myBooks.map(withDaysLeft),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Expiring Books ────────────────────────────────────────────
// GET /api/issued/expiring
export const getExpiringBooks = async (req, res) => {
  try {
    await refreshStatuses();

    const expiring = await IssuedBook.find({ status: "expiring" }).sort({ endDate: 1 });

    res.json({
      success: true,
      count: expiring.length,
      data: expiring.map(withDaysLeft),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Return Book ───────────────────────────────────────────────────
// PATCH /api/issued/:id/return
export const returnBook = async (req, res) => {
  try {
    const issued = await IssuedBook.findById(req.params.id);

    if (!issued) {
      return res.status(404).json({ success: false, message: "Issued record not found" });
    }

    issued.status = "returned";
    await issued.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: "Book returned successfully",
      data: withDaysLeft(issued),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Stats ─────────────────────────────────────────────────────
// GET /api/issued/stats
export const getStats = async (req, res) => {
  try {
    await refreshStatuses();

    const [total, expiring, expired, returned] = await Promise.all([
      IssuedBook.countDocuments({ status: { $ne: "returned" } }),
      IssuedBook.countDocuments({ status: "expiring" }),
      IssuedBook.countDocuments({ status: "expired" }),
      IssuedBook.countDocuments({ status: "returned" }),
    ]);

    res.json({
      success: true,
      data: { total, expiring, expired, returned },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Refresh Status Helper ─────────────────────────────────────────
const refreshStatuses = async () => {
  const now = new Date();

  await IssuedBook.updateMany(
    { endDate: { $lt: now }, status: { $nin: ["returned", "expired"] } },
    { $set: { status: "expired" } }
  );

  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  await IssuedBook.updateMany(
    {
      endDate: { $gte: now, $lte: threeDaysLater },
      status: { $nin: ["returned", "expiring"] },
    },
    { $set: { status: "expiring" } }
  );

  await IssuedBook.updateMany(
    {
      endDate: { $gt: threeDaysLater },
      status: { $nin: ["returned", "active"] },
    },
    { $set: { status: "active" } }
  );
};