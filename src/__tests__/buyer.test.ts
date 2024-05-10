import prisma from "../utilis/prisma";
import { CreateBuyerInput } from "../modules/buyer/buyer.schema";
import {
  createBuyerProfile,
  findBuyerByEmail,
} from "../modules/buyer/buyer.service";
import { getAllBuyers } from "../modules/buyer/buyer.service";

jest.mock("../utilis/prisma", () => ({
  buyer: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
}));

describe("createBuyerProfile", () => {
  const mockInput: CreateBuyerInput = {
    email: "test@example.com",
    name: "Test Buyer",
    webhookUrl: "https://example.com/webhook",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new buyer profile if no buyer with the same email exists", async () => {
    (prisma.buyer.findUnique as jest.Mock).mockResolvedValueOnce(null);

    (prisma.buyer.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      ...mockInput,
    });

    const result = await createBuyerProfile(mockInput);

    expect(prisma.buyer.findUnique).toHaveBeenCalledWith({
      where: { email: mockInput.email },
      select: { id: true },
    });

    expect(prisma.buyer.create).toHaveBeenCalledWith({ data: mockInput });

    expect(result).toEqual({ id: 1, ...mockInput });
  });

  it("should throw an error if a buyer with the same email already exists", async () => {
    const existingBuyer = { id: 1, ...mockInput };
    (prisma.buyer.findUnique as jest.Mock).mockResolvedValueOnce(existingBuyer);

    await expect(createBuyerProfile(mockInput)).rejects.toThrow(
      "Buyer with this email already exists",
    );

    expect(prisma.buyer.create).not.toHaveBeenCalled();
  });
});

describe("getAllBuyers", () => {
  const mockBuyers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];
  const mockTotalCount = 10;
  const page = 2;
  const limit = 5;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return buyers and pagination data", async () => {
    (prisma.buyer.findMany as jest.Mock).mockResolvedValue(mockBuyers);
    (prisma.buyer.count as jest.Mock).mockResolvedValue(mockTotalCount);

    const result = await getAllBuyers(page, limit);

    expect(prisma.buyer.findMany).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
    expect(prisma.buyer.count).toHaveBeenCalled();
    expect(result).toEqual({
      data: mockBuyers,
      totalCount: mockTotalCount,
      page,
      limit,
    });
  });

  it("should handle empty buyer list", async () => {
    const mockBuyers: never[] = [];
    const mockTotalCount = 0;

    (prisma.buyer.findMany as jest.Mock).mockResolvedValue(mockBuyers);
    (prisma.buyer.count as jest.Mock).mockResolvedValue(mockTotalCount);

    const result = await getAllBuyers(page, limit);

    expect(prisma.buyer.findMany).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
    expect(prisma.buyer.count).toHaveBeenCalled();
    expect(result).toEqual({
      data: mockBuyers,
      totalCount: mockTotalCount,
      page,
      limit,
    });
  });
});

describe("findBuyerByEmail", () => {
  const { buyer } = prisma;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a buyer object if the email exists", async () => {
    const mockEmail = "test@example.com";
    const mockBuyer = { id: 1 };

    (buyer.findUnique as jest.Mock).mockResolvedValueOnce(mockBuyer);

    const result = await findBuyerByEmail(mockEmail);

    expect(buyer.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true },
    });
    expect(result).toEqual(mockBuyer);
  });

  it("should return null if the email does not exist", async () => {
    const mockEmail = "nonexistent@example.com";

    (buyer.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const result = await findBuyerByEmail(mockEmail);

    expect(buyer.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true },
    });
    expect(result).toBeNull();
  });
});
