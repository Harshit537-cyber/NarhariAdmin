import apiClient from "../Interceptor/apiClient";

// Get All Support Tickets

export const getAllTickets = async () => {

  try {
    const response = await apiClient.get("/tickets/admin/all");

    return response.data;

  } catch (error) {

    throw (

      error.response?.data || {

        message: "Something went wrong",
      }
    );
  }
};


// Update Ticket
export const updateTicket = async (ticketId, data) => {
  try {

    const response = await apiClient.put(

      `/tickets/admin/update/${ticketId}`,

      data
    );

    return response.data;
  } catch (error) {

    throw (
      error.response?.data || {

        message: "Something went wrong",
      }
    );
  }
};