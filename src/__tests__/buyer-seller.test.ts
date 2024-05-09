import { connectBuyerSeller } from "../modules/buyer-seller/buyer-seller.service";
import prisma from "../utilis/prisma";

jest.mock("../utilis/prisma", () => ({
  buyerSeller: {
    create: jest.fn(),
  },
}));

describe("connectBuyerSeller", () => {
  const { buyerSeller } = prisma;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new buyerSeller connection", async () => {
    const mockInput = {
      buyerId: 1,
      sellerId: 2,
    };

    const mockCreate = buyerSeller.create as jest.Mock;
    mockCreate.mockResolvedValueOnce(null);

    const result = await connectBuyerSeller(mockInput);

    expect(buyerSeller.create).toHaveBeenCalledWith({
      data: {
        buyerId: mockInput.buyerId,
        sellerId: mockInput.sellerId,
      },
    });
    expect(result).toEqual({
      success: true,
      message: "Connection created successfully",
    });
  });

  it("should handle create connection failure", async () => {
    const mockInput = {
      buyerId: 1,
      sellerId: 2,
    };

    const mockCreate = buyerSeller.create as jest.Mock;
    mockCreate.mockRejectedValueOnce(new Error("Failed to create connection"));

    const result = await connectBuyerSeller(mockInput);

    expect(buyerSeller.create).toHaveBeenCalledWith({
      data: {
        buyerId: mockInput.buyerId,
        sellerId: mockInput.sellerId,
      },
    });
    expect(result).toEqual({
      success: false,
      message: "Failed to create connection",
    });
  });
});
