import { HoursWorked } from "../models/HoursWorked";
import { Employee } from "../models/Employee";
import { Schedule } from "../models/Schedule";

export const createOrUpdateHoursWorked = async (employeeId: number, date: Date, scheduleId: number) => {
  const schedule = await Schedule.findOne({ where: { id: scheduleId } });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  const existingRecord = await HoursWorked.findOne({ where: { employeeId, date, scheduleId } });

  if (existingRecord) {
    await existingRecord.save();
    return existingRecord;
  } else {
    return await HoursWorked.create({ employeeId, date, scheduleId });
  }
};


export const getAllHoursWorked = async () => {
  return await HoursWorked.findAll({
    include: [
      { model: Employee, attributes: ["firstName", "lastName"] },
      { model: Schedule, attributes: ["day", "label", "hours"] },
    ],
  });
};

export const getHoursWorkedById = async (id: number) => {
  return await HoursWorked.findByPk(id, {
    include: [
      { model: Employee, attributes: ["firstName", "lastName"] },
      { model: Schedule, attributes: ["day", "label", "hours"] },
    ],
  });
};

export const updateHoursWorked = async (id: number, data: Partial<HoursWorked>) => {
  const [updated] = await HoursWorked.update(data, { where: { id } });
  if (updated) {
    return await HoursWorked.findByPk(id);
  }
  return null;
};

export const deleteHoursWorked = async (id: number) => {
  const deleted = await HoursWorked.destroy({ where: { id } });
  return deleted;
};
