import DirectingModel from "../models/DirectingModel.js";
import UserModel from "../models/UserModel.js";

export const createDirecting = async (req, res) => {
  try {
    const {
      name,
      description,
      admins,
      imagePath,
      secondDescription,
      secondImagePath,
    } = req.body;

    if (!name || !description || admins.length < 1) {
      return res.status(401).json({
        message: "Заполните все необходимые поля",
      });
    }

    const doc = new DirectingModel({
      name,
      description,
      admins,
      imagePath,
      secondDescription,
      secondImagePath,
    });

    const directing = await doc.save();

    const directingData = directing._doc;

    return res.status(200).json(directingData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создат направление",
    });
  }
};

export const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await UserModel.find({
      role: {
        $in: [
          "Руководителя направления",
          "Руководитель в.о.",
          "Организатор",
          "Администратор",
        ],
      },
    });
    res.status(200).json(organizers);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить всех организаторов",
    });
  }
};

export const getAllDirecting = async (req, res) => {
  try {
    const directing = await DirectingModel.find()
      .populate("admins")
      .populate("members")
      .exec();

    return res.status(200).send(directing);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить направления",
    });
  }
};

export const getDirecting = async (req, res) => {
  try {
    const directind_id = req.params.id;
    const getDirecting = await DirectingModel.findById(directind_id);

    return res.status(200).send(getDirecting);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить направление",
    });
  }
};

export const getAdminsDirecting = async (req, res) => {
  try {
    const userId = req.params.id;

    const directing = await DirectingModel.find({ admins: userId });
    res.status(200).json(directing);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить направления",
    });
  }
};

export const getStudentsDirecting = async (req, res) => {
  try {
    const userId = req.params.id;

    const directing = await DirectingModel.find({ members: userId });
    res.status(200).json(directing);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить направления",
    });
  }
};

export const updateDirecting = async (req, res) => {
  try {
    const directingId = req.params.id;

    const {
      name,
      description,
      admins,
      imagePath,
      secondDescription,
      secondImagePath,
      gallery,
      applications,
      members,
    } = req.body;

    if (!name || !description || admins.length < 1) {
      return res.status(401).json({
        message: "Заполните все необходимые поля",
      });
    }

    const updateDirecting = await DirectingModel.findByIdAndUpdate(
      directingId,
      {
        name,
        description,
        admins,
        imagePath,
        secondDescription,
        secondImagePath,
        gallery,
        applications,
        members,
      }
    );

    if (!updateDirecting) {
      return res.status(401).json({
        message: "Не удалось обновить направление!",
      });
    }

    return res.status(200).json(updateDirecting);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить направления",
    });
  }
};

export const addUserToApplications = async (req, res) => {
  try {
    const directingId = req.params.id;
    const userId = req.userId;

    const directing = await DirectingModel.findById(directingId);

    if (!directing) {
      return res.status(404).json({
        message: "Направление не найдено",
      });
    }

    if (directing.applications.includes(userId)) {
      return res.status(400).json({
        message: "Пользователь уже добавлен в заявки",
      });
    }

    directing.applications.push(userId);
    await directing.save();

    return res.status(200).json({
      message: "Пользователь успешно добавлен в заявки",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить пользователя в заявки",
    });
  }
};

export const getUsersFromApplications = async (req, res) => {
  try {
    const directingId = req.params.id;

    const directing = await DirectingModel.findById(directingId).populate(
      "applications"
    );

    if (!directing) {
      return res.status(404).json({
        message: "Направление не найдено",
      });
    }

    return res.status(200).json(directing.applications);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пользователей из заявок",
    });
  }
};

export const getUsersFromMembers = async (req, res) => {
  try {
    const directingId = req.params.id;

    const directing = await DirectingModel.findById(directingId).populate(
      "members"
    );

    if (!directing) {
      return res.status(404).json({
        message: "Направление не найдено",
      });
    }

    console.log(directing.members);

    return res.status(200).json(directing.members);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пользователей из участников",
    });
  }
};

export const getDirectingAdmins = async (req, res) => {
  try {
    const directingId = req.params.id;

    const directing = await DirectingModel.findById(directingId)
      .populate("admins")
      .exec();

    if (!directing) {
      return res.status(404).json({
        message: "Не удалось найти направление",
      });
    }

    return res.status(200).json(directing.admins);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить руководителей",
    });
  }
};
