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

export async function createExcelEvent(event_id) {
  try {
    const event = await EventModel.findById(event_id)
      .populate("members")
      .exec();


    const data = [
      [event.name, `${event.start} - ${event.finish}`],
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

    // Использовать синхронную функцию записи файла
    XLSX.writeFile(workbook, filePath);

    return Promise.resolve(filePath);
  } catch (error) {
    console.error("Ошибка при создании Excel файла:", error);
    throw new Error("Не удалось создать Excel файл");
  }
}
