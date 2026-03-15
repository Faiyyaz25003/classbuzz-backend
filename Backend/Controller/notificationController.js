import Notification from "../Models/notificationModel.js";

// GET /api/notifications/user/:userId
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({
      $or: [
        { targetUsers: userId },
        { targetAll: true },
      ],
      deletedBy: { $ne: userId },
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    await Notification.findByIdAndUpdate(id, {
      $addToSet: { readBy: userId },
    });

    res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/mark-all-read
export const markAllRead = async (req, res) => {
  try {
    const { userId } = req.body;

    await Notification.updateMany(
      {
        $or: [{ targetUsers: userId }, { targetAll: true }],
        readBy: { $ne: userId },
      },
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/notifications/:id/user/:userId
export const deleteNotificationForUser = async (req, res) => {
  try {
    const { id, userId } = req.params;

    await Notification.findByIdAndUpdate(id, {
      $addToSet: { deletedBy: userId },
    });

    res.status(200).json({ message: "Notification removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};