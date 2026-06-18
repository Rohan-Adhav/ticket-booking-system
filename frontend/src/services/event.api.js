import axiosInstance from "./axiosInstance.js";

export const getEvents = async () => {
  const res = await axiosInstance.get("/events");
  return res.data.data;
};

export const getEventById = async (id) => {
  const res = await axiosInstance.get(`/events/${id}`);
  return res.data.data;
};

export const createEvent = async (payload) => {
    const res = await axiosInstance.post("/events", payload);
    return res.data.data;
};