import axiosInstance from "./axiosInstance.js";

export const confirmBooking = async (reservationId) => {
  const res = await axiosInstance.post("/bookings", {
    reservationId,
  });

  return res.data.data;
};