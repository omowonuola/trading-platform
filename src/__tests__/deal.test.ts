import { CreateDealInput, DealStatus } from "../modules/deals/deal.schema";
import prisma from "../utilis/prisma";
import {
  createDeal,
  findDealByName,
  getDealsByUserId,
  getDealsFromSeller,
} from "../modules/deals/deal.services";

const mockInput: CreateDealInput & { sellerId: number } = {
  status: DealStatus.available,
  name: "Test Deal",
  currency: "USD",
  totalPrice: 100,
  discount: null,
  items: [
    { name: "Item 1", price: 50 },
    { name: "Item 2", price: 50 },
  ],
  sellerId: 1,
};

const mockBuyerId = 1;
const mockConnectedSellers = [
  { sellerId: 1 },
  { sellerId: 2 },
  { sellerId: 3 },
];
const mockDeals = [
  {
    id: 1,
    name: "Deal 1",
    sellerId: 1,
    items: [{ id: 1, name: "Item 1", price: 10 }],
  },
  {
    id: 2,
    name: "Deal 2",
    sellerId: 2,
    items: [{ id: 2, name: "Item 2", price: 20 }],
  },
  {
    id: 3,
    name: "Deal 3",
    sellerId: 3,
    items: [{ id: 3, name: "Item 3", price: 30 }],
  },
];

jest.mock("../utilis/prisma", () => ({
  deal: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  buyerSeller: {
    findMany: jest.fn(),
  },
}));

jest.mock("./../modules/deals/deal.services", () => ({
  createDeal: jest.fn().mockImplementation(async (input) => {
    const { name } = input;
    const existingDeal = await findDealByName(name);
    if (existingDeal) {
      throw new Error("Deal with this name already exists");
    }
    const createdDeal = await prisma.deal.create({
      data: {
        ...input,
        items: {
          create: input.items?.map((item: { name: string; price: number }) => ({
            name: item.name,
            price: item.price,
          })),
        },
      },
    });
    return createdDeal;
  }),

  findDealByName: jest.fn().mockResolvedValue(null),

  //   getDealsFromSeller: jest.fn(),

  //   getDealsFromSeller: jest.fn().mockImplementation(async (buyerId) => {
  //     const mockConnectedSeller = mockConnectedSellers.map(
  //       (seller: { sellerId: number }) => seller.sellerId,
  //     );
  //     return mockDeals.filter((deal) =>
  //       mockConnectedSeller.includes(deal.sellerId),
  //     );
  //   }),

  getDealsFromSeller: jest.fn().mockImplementation(async (buyerId) => {
    const connectedSellers = await prisma.buyerSeller.findMany({
      where: { buyerId },
      select: { sellerId: true },
    });
    const connectedSellerIds = connectedSellers.map(
      (seller: { sellerId: number }) => seller.sellerId,
    );
    return mockDeals.filter((deal) =>
      connectedSellerIds.includes(deal.sellerId),
    );
  }),

  getDealsByUserId: jest.fn().mockImplementation(async (id) => {
    const deals = await prisma.deal.findMany({
      where: { sellerId: id },
      include: { items: true },
    });
    return deals;
  }),
}));

describe("createDeal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new deal if no deal with the same name exists", async () => {
    (findDealByName as jest.Mock).mockResolvedValueOnce(null);

    (prisma.deal.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      ...mockInput,
    });

    const result = await createDeal(mockInput);

    expect(findDealByName).toHaveBeenCalledWith(mockInput.name);
    expect(prisma.deal.create).toHaveBeenCalledWith({
      data: {
        ...mockInput,
        items: {
          create: mockInput.items?.map((item) => ({
            name: item.name,
            price: item.price,
          })),
        },
      },
    });
    expect(result).toEqual({ id: 1, ...mockInput });
  });

  it("should throw an error if a deal with the same name already exists", async () => {
    (findDealByName as jest.Mock).mockResolvedValueOnce({
      id: 1,
      name: "Test Deal",
    });

    await expect(createDeal(mockInput)).rejects.toThrow(
      "Deal with this name already exists",
    );
    expect(prisma.deal.create).not.toHaveBeenCalled();
  });
});

describe("getDealsByUserId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return deals for the given user ID", async () => {
    const userId = 1;
    const mockDeals = [
      {
        id: 1,
        name: "Deal 1",
        currency: "USD",
        totalPrice: 100,
        discount: null,
        items: [
          { id: 1, name: "Item 1", price: 50 },
          { id: 2, name: "Item 2", price: 50 },
        ],
        sellerId: userId,
      },
      {
        id: 2,
        name: "Deal 2",
        currency: "USD",
        totalPrice: 200,
        discount: 10,
        items: [
          { id: 3, name: "Item 3", price: 100 },
          { id: 4, name: "Item 4", price: 100 },
        ],
        sellerId: userId,
      },
    ];

    (prisma.deal.findMany as jest.Mock).mockResolvedValueOnce(mockDeals);

    const result = await getDealsByUserId(userId);

    expect(prisma.deal.findMany).toHaveBeenCalledWith({
      where: { sellerId: userId },
      include: { items: true },
    });
    expect(result).toEqual(mockDeals);
  });

  it("should return an empty array if no deals are found for the user", async () => {
    const userId = 1;
    (prisma.deal.findMany as jest.Mock).mockResolvedValueOnce([]);

    const result = await getDealsByUserId(userId);

    expect(prisma.deal.findMany).toHaveBeenCalledWith({
      where: { sellerId: userId },
      include: { items: true },
    });
    expect(result).toEqual([]);
  });
});

describe("getDealsFromSeller", () => {
  beforeEach(() => {
    (prisma.buyerSeller.findMany as jest.Mock).mockResolvedValue(
      mockConnectedSellers,
    );
    (prisma.deal.findMany as jest.Mock).mockResolvedValue(mockDeals);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return deals from connected sellers", async () => {
    const deals = await getDealsFromSeller(mockBuyerId);
    expect(prisma.buyerSeller.findMany).toHaveBeenCalledWith({
      where: { buyerId: mockBuyerId },
      select: { sellerId: true },
    });
    expect(prisma.deal.findMany).toHaveBeenCalledWith({
      where: { sellerId: 1 },
      include: { items: true },
    });
    expect(deals).toEqual(mockDeals);
  });

  it("should return an empty array if no connected sellers", async () => {
    (prisma.buyerSeller.findMany as jest.Mock).mockResolvedValue([]);
    const deals = await getDealsFromSeller(mockBuyerId);
    expect(prisma.buyerSeller.findMany).toHaveBeenCalledWith({
      where: { buyerId: mockBuyerId },
      select: { sellerId: true },
    });
    expect(prisma.deal.findMany).not.toHaveBeenCalled();
    expect(deals).toEqual([]);
  });
});
