import EventModel from "../models/EventModel.js";
import UserModel from "../models/UserModel.js";

export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      imagePath,
      start,
      finish,
      directing,
      place,
      contact_name,
      contact_email,
      contact_work,
    } = req.body;

    if (
      !name ||
      !description ||
      !start ||
      !finish ||
      !imagePath ||
      !directing ||
      !place ||
      !contact_name ||
      !contact_email ||
      !contact_work
    ) {
      return res.status(401).json({
        message: "Заполните все необходимые поля",
      });
    }

    const doc = new EventModel({
      name,
      description,
      imagePath,
      start,
      finish,
      directing,
      place,
      contact_name,
      contact_email,
      contact_work,
      admins,
    });

    const event = await doc.save();

    const eventData = event._doc;

    return res.status(200).json(eventData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создат направление",
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const getEvents = await EventModel.find();

    if (!getEvents) {
      return res.status(404).json({
        message: "Не удалось получить события",
      });
    }

    return res.status(200).json(getEvents);
  } catch (err) {
    console.log(err);
    res.start(500).json({
      message: "Не удалось получить мероприятия",
    });
  }
};

export const getEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Не удалось получить событие",
      });
    }

    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить мероприятия",
    });
  }
};

export const getMembers = async (req, res) => {
  try {
    const eventId = req.params.id;

    const getEvent = await EventModel.findById(eventId)
      .populate("members")
      .exec();

    if (!getEvent) {
      return res.status(500).json({
        message: "Не удалось найти событие",
      });
    }

    return res.status(200).json(getEvent.members);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить участников",
    });
  }
};

export const getApplications = async (req, res) => {
  try {
    const eventId = req.params.id;

    const getEvent = await EventModel.findById(eventId)
      .populate("applications")
      .exec();

    if (!getEvent) {
      return res.status(500).json({
        message: "Не удалось найти событие",
      });
    }

    return res.status(200).json(getEvent.applications);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить участников",
    });
  }
};

export const getUserApplicationsFull = async (req, res) => {
  try {
    const eventId = req.params.id;

    const getEvent = await EventModel.findById(eventId)
      .populate("userApplications")
      .exec();

    if (!getEvent) {
      return res.status(500).json({
        message: "Не удалось найти событие",
      });
    }

    return res.status(200).json(getEvent.userApplications);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить участников",
    });
  }
};

export const addUserToApplications = async (req, res) => {
  try {
    const eventId = req.body.eventId;
    const userId = req.body.userId;

    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    if (event.applications.includes(userId)) {
      return res.status(400).json({
        message: "Пользователь уже добавлен в заявки",
      });
    }

    event.applications.push(userId);
    await event.save();

    return res.status(200).json({
      message: "Пользователь успешно добавлен в заявки",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить пользователя в список ожидания",
    });
  }
};

export const addUserToMembers = async (req, res) => {
  try {
    const eventId = req.body.eventId;
    const userId = req.body.userId;

    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    if (event.members.includes(userId)) {
      return res.status(400).json({
        message: "Пользователь уже добавлен в участники",
      });
    }

    // Удаляем userId из массива applications
    event.applications = event.applications.filter(
      (id) => id.toString() !== userId.toString()
    );

    event.members.push(userId);
    await event.save();

    return res.status(200).json({
      message: "Пользователь успешно добавлен в участники",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить пользователя в список ожидания",
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const updateEvent = await EventModel.findByIdAndUpdate(eventId, {
      name: req.body.name,
      description: req.body.description,
      members: req.body.members,
      applications: req.body.applications,
      start: req.body.start,
      finish: req.body.finish,
      imagePath: req.body.imagePath,
      userApplications: req.body.userApplications,
      directing: req.body.directing,
      place: req.body.place,
      contact_name: req.body.contact_name,
      contact_email: req.body.contact_email,
      contact_work: req.body.contact_work,
      admins: req.body.admins,
    });

    if (!updateEvent) {
      return res.status(404).json({
        message: "Не удалось обновить событие",
      });
    }

    res.status(200).json(updateEvent);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить событие",
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Событие не найдено",
      });
    }

    const students = await UserModel.find({
      role: "Студент",
      _id: {
        $nin: [
          ...event.members,
          ...event.applications,
          ...event.userApplications,
        ],
      },
    });

    if (!students.length) {
      return res.status(404).json({
        message: "Студенты не найдены",
      });
    }

    return res.status(200).json(students);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить студентов",
    });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const userId = req.userId;
    const events = await EventModel.find({
      applications: userId,
    });

    if (!events.length) {
      return res.status(404).json({
        message: "Приглашения не найдены",
      });
    }

    return res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить приглашения",
    });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const userId = req.params.id;
    const events = await EventModel.find({
      members: userId,
    });

    if (!events.length) {
      return res.status(404).json({
        message: "Приглашения не найдены",
      });
    }

    return res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить приглашения",
    });
  }
};

export const addUserToUserApplications = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Мероприятие не найдено",
      });
    }

    if (!event.userApplications.includes(req.userId)) {
      event.userApplications.push(req.userId);
      await event.save();
    }

    return res.status(200).json({
      message: "Пользователь успешно добавлен",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить пользователя",
    });
  }
};
