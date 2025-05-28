import * as XLSX from "xlsx";

import DirectionModel from "../models/DirectingModel.js";
import EventModel from "../models/EventModel.js";

export async function createExcelDirection(direction_id) {
  try {
    const direction = await DirectionModel.findById(direction_id)
      .populate("members")
      .exec();
    const data = [[direction.name], ["ФИО", "Телефон", "Группа", "E-mail"]];

    direction.members.forEach((member) => {
      data.push([member.fullName, member.phone, member.group, member.email]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Лист1");

    const uniqueSuffix = crypto.randomUUID();
    const filePath = `./download/${uniqueSuffix}.xlsx`;

    // Использовать синхронную функцию записи файла
    XLSX.writeFile(workbook, filePath);

    return Promise.resolve(filePath);
  } catch (error) {
    console.error("Ошибка при создании Excel файла:", error);
    throw new Error("Не удалось создать Excel файл");
  }
}

export async function createExcelEvent(event_id, meta = {}) {
  try {
    const event = await EventModel.findById(event_id)
      .populate("members")
      .exec();

    const { date, title, person, desc, count, place } = meta;

    const data = [
      ["Дата:", date || ""],
      ["Название:", title || event.name],
      ["Сотрудник:", person || ""],
      ["Описание:", desc || ""],
      ["Присутствовало:", count || ""],
      ["Место проведения:", place || ""],
      [],
      ["ФИО", "Телефон", "Группа", "E-mail"],
    ];

    event.members.forEach((member) => {
      data.push([member.fullName, member.phone, member.group, member.email]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Лист1");

    const uniqueSuffix = crypto.randomUUID();
    const filePath = `./download/${uniqueSuffix}.xlsx`;
    XLSX.writeFile(workbook, filePath);

    return filePath;
  } catch (error) {
    console.error("Ошибка при создании Excel файла:", error);
    throw new Error("Не удалось создать Excel файл");
  }
}

export async function createExcelDirectionMembersOnly(direction_id) {
  try {
    const direction = await DirectionModel.findById(direction_id)
      .populate("members")
      .exec();

    if (!direction) {
      throw new Error("Студенческое объединение не найдено");
    }

    const data = [
      [`Студенческое объединение: ${direction.name}`],
      [],
      ["ФИО", "Телефон", "Группа", "E-mail"],
    ];

    direction.members.forEach((member) => {
      data.push([
        member.fullName || "",
        member.phone || "",
        member.group || "",
        member.email || "",
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Участники");

    const uniqueSuffix = crypto.randomUUID();
    const filePath = `./download/direction-members-${uniqueSuffix}.xlsx`;

    XLSX.writeFile(workbook, filePath);
    return filePath;
  } catch (error) {
    console.error(
      "Ошибка при создании Excel списка участников направления:",
      error
    );
    throw new Error("Не удалось создать Excel файл участников Студенческого объединения");
  }
}
