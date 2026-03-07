import Folder from "../Models/folderModels.js";

/* CREATE FOLDER */

export const createFolder = async (req, res) => {
  try {
    const folder = new Folder(req.body);

    await folder.save();

    res.json({
      success: true,
      message: "Folder created",
      folder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL FOLDERS */

export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find();

    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE FOLDER */

export const deleteFolder = async (req, res) => {
  try {
    await Folder.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Folder deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};