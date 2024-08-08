// Unit tests for: handler

import { llamaScheduler } from "@/lib/llamaScheduler";

import handler from "../route";

// Mocking the llamaScheduler function
jest.mock("@/lib/llamaScheduler", () => ({
  llamaScheduler: jest.fn(),
}));

// Mock interfaces
interface MockNextApiRequest {
  method?: string;
  body?: any;
}

type MockNextApiResponse = {
  status: jest.Mock;
  json: jest.Mock;
  end: jest.Mock;
};

describe("handler() handler method", () => {
  let mockReq: MockNextApiRequest;
  let mockRes: MockNextApiResponse;

  beforeEach(() => {
    mockReq = {
      method: "POST",
      body: {
        userId: "123",
        appointmentDetails: { date: "2023-10-10", time: "10:00" },
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    } as any;
  });

  describe("Happy Path", () => {
    it("should return 200 and the schedule when llamaScheduler succeeds", async () => {
      // Arrange
      const mockSchedule = { id: "abc", date: "2023-10-10", time: "10:00" };
      (llamaScheduler as jest.Mock).mockResolvedValue(
        mockSchedule as any as never,
      );

      // Act
      await handler(mockReq as any, mockRes as any);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockSchedule);
    });
  });

  describe("Edge Cases", () => {
    it("should return 500 when llamaScheduler throws an error", async () => {
      // Arrange
      (llamaScheduler as jest.Mock).mockRejectedValue(
        new Error("Failed to schedule appointment") as never,
      );

      // Act
      await handler(mockReq as any, mockRes as any);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to schedule appointment",
      });
    });

    it("should return 405 when method is not POST", async () => {
      // Arrange
      mockReq.method = "GET";

      // Act
      await handler(mockReq as any, mockRes as any);

      // Assert
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockRes.end).toHaveBeenCalled();
    });

    it("should handle missing userId in request body", async () => {
      // Arrange
      mockReq.body = {
        appointmentDetails: { date: "2023-10-10", time: "10:00" },
      };

      // Act
      await handler(mockReq as any, mockRes as any);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to schedule appointment",
      });
    });

    it("should handle missing appointmentDetails in request body", async () => {
      // Arrange
      mockReq.body = { userId: "123" };

      // Act
      await handler(mockReq as any, mockRes as any);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to schedule appointment",
      });
    });
  });
});

// End of unit tests for: handler
