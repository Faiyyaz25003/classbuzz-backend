import Announcement from "../Models/announcementModel.js";

// CREATE
export const createAnnouncement = async (req, res) => {

  try {

    const newAnnouncement = new Announcement({

      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      department: req.body.department,
      startDate: req.body.startDate,
      file: req.file ? req.file.filename : ""

    });

    const saved = await newAnnouncement.save();

    res.json(saved);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// GET ALL
export const getAnnouncements = async (req, res) => {

  try {

    const data = await Announcement
      .find()
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// UPDATE
export const updateAnnouncement = async (req, res) => {

  try {

    const updateData = {

      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      department: req.body.department,
      startDate: req.body.startDate

    };

    if (req.file) {
      updateData.file = req.file.filename;
    }

    const data = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(data);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


// DELETE
export const deleteAnnouncement = async (req, res) => {

  try {

    await Announcement.findByIdAndDelete(req.params.id);

    res.json({ message: "Announcement Deleted" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};