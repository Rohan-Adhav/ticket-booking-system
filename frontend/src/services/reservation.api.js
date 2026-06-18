import axiosInstance from "./axiosInstance.js";

export const reserveSeats = async (eventId, seatNumbers) => {
  const res = await axiosInstance.post("/reserve", {
    eventId,
    seatNumbers,
  });

  return res.data.data;
};