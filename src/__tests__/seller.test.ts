import prisma from "../utilis/prisma";
import { CreateSellerInput } from "../modules/seller/seller.schema";
import {
  createSellerProfile,
  findSellerByEmail,
  getAllSellers,
} from "../modules/seller/seller.service";

jest.mock("../utilis/prisma", () => ({
  seller: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
}));

describe("createSellerProfile", () => {
  const mockInput: CreateSellerInput = {
    email: "test@example.com",
    name: "Test Seller",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a new seller profile if no seller with the same email exists", async () => {
    (prisma.seller.findUnique as jest.Mock).mockResolvedValueOnce(null);

    (prisma.seller.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      ...mockInput,
    });

    const result = await createSellerProfile(mockInput);

    expect(prisma.seller.findUnique).toHaveBeenCalledWith({
      where: { email: mockInput.email },
      select: { id: true },
    });

    expect(prisma.seller.create).toHaveBeenCalledWith({ data: mockInput });

    expect(result).toEqual({ id: 1, ...mockInput });
  });

  it("should throw an error if a seller with the same email already exists", async () => {
    const existingSeller = { id: 1, ...mockInput };
    (prisma.seller.findUnique as jest.Mock).mockResolvedValueOnce(
      existingSeller,
    );

    await expect(createSellerProfile(mockInput)).rejects.toThrow(
      "Seller with this email already exists",
    );

    expect(prisma.seller.create).not.toHaveBeenCalled();
  });
});

describe("getAllSellers", () => {
  const mockSellers = [
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

  it("should return sellers and pagination data", async () => {
    (prisma.seller.findMany as jest.Mock).mockResolvedValue(mockSellers);
    (prisma.seller.count as jest.Mock).mockResolvedValue(mockTotalCount);

    const result = await getAllSellers(page, limit);

    expect(prisma.seller.findMany).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
    expect(prisma.seller.count).toHaveBeenCalled();
    expect(result).toEqual({
      data: mockSellers,
      totalCount: mockTotalCount,
      page,
      limit,
    });
  });

  it("should handle empty seller list", async () => {
    const mockSellers: never[] = [];
    const mockTotalCount = 0;

    (prisma.seller.findMany as jest.Mock).mockResolvedValue(mockSellers);
    (prisma.seller.count as jest.Mock).mockResolvedValue(mockTotalCount);

    const result = await getAllSellers(page, limit);

    expect(prisma.seller.findMany).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
    expect(prisma.seller.count).toHaveBeenCalled();
    expect(result).toEqual({
      data: mockSellers,
      totalCount: mockTotalCount,
      page,
      limit,
    });
  });
});

describe("findSellerByEmail", () => {
  const { seller } = prisma;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a seller object if the email exists", async () => {
    const mockEmail = "test@example.com";
    const mockSeller = { id: 1 };

    (seller.findUnique as jest.Mock).mockResolvedValueOnce(mockSeller);

    const result = await findSellerByEmail(mockEmail);

    expect(seller.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true },
    });
    expect(result).toEqual(mockSeller);
  });

  it("should return null if the email does not exist", async () => {
    const mockEmail = "nonexistent@example.com";

    (seller.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const result = await findSellerByEmail(mockEmail);

    expect(seller.findUnique).toHaveBeenCalledWith({
      where: { email: mockEmail },
      select: { id: true },
    });
    expect(result).toBeNull();
  });
});
