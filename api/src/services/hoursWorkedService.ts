import { HoursWorked } from '../models/HoursWorked';

export const createHoursWorked = async (data: {
  employeeId: number;
  date: Date;
  hours: number;
}) => {
  return HoursWorked.create(data);
};

export const getAllHoursWorked = async () => {
  return HoursWorked.findAll();
};

export const getHoursWorkedById = async (id: number) => {
  return HoursWorked.findByPk(id);
};

export const updateHoursWorked = async (
  id: number,
  data: { employeeId?: number; date?: Date; hours?: number }
) => {
  await HoursWorked.update(data, { where: { id } });
  return HoursWorked.findByPk(id);
};

export const deleteHoursWorked = async (id: number) => {
  return HoursWorked.destroy({ where: { id } });
};
