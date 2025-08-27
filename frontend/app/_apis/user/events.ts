const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1`;

export interface EventResponse {
  id?: number;
  organizerId: number;
  type: string;
  title: string;
  description: string;
  location: string;
  eventStartDate: string;
  eventEndDate: string;
  maxParticipant: number;
  eventImg: string;
  status: string;
  documentLink: string;
}

export interface EventsApiResponse {
  content: {
    data: EventResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  message: string;
  code: string;
  success: boolean;
  pagination: null | {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// Get all events
export async function getEvents(): Promise<EventResponse[]> {
  try {
    const response = await fetch(`${endpoint}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (
      data.success &&
      data.content &&
      data.content.data &&
      Array.isArray(data.content.data)
    ) {
      return data.content.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data.events && Array.isArray(data.events)) {
      return data.events;
    } else {
      console.warn("Unexpected API response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

// Get events by date range
export async function getEventsByDateRange(
  startDate: string,
  endDate: string
): Promise<EventResponse[]> {
  try {
    const response = await fetch(
      `${endpoint}/events?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (
      data.success &&
      data.content &&
      data.content.data &&
      Array.isArray(data.content.data)
    ) {
      return data.content.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data.events && Array.isArray(data.events)) {
      return data.events;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching events by date range:", error);
    throw error;
  }
}

// Get event by ID
export async function getEventById(eventId: number): Promise<EventResponse> {
  try {
    const response = await fetch(`${endpoint}/events/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.content) {
      return data.content;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
}
