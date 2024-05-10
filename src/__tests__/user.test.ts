import { CreateUserInput } from "../modules/user/user.schema";
import prisma from "../utilis/prisma";
import { createUser, findUserByEmail } from "../modules/user/user.service";
import { hashPassword } from "../utilis/auth";
import { createBuyerProfile } from "../modules/buyer/buyer.service";
import { createSellerProfile } from "../modules/seller/seller.service";

const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  roleId: 1,
  role: { id: 1, name: "buyer" },
};

const mockInput: CreateUserInput = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  roleId: 1,
};
jest.mock("../utilis/prisma", () => ({
  user: {
    create: jest.fn(),
  },
}));

jest.mock("../modules/user/user.service", () => ({
  createUser: jest.fn().mockImplementation(async (input) => {
    const { email } = input;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const hashedPassword = await hashPassword(input.password);
    await prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
      },
      include: { role: true },
    });
    const userWithProfile = await createBuyerProfile({
      email: input.email,
      name: input.name,
      webhookUrl: "https://example.com/webhook",
    });
    return userWithProfile;
  }),
  findUserByEmail: jest.fn(),
}));

jest.mock("../utilis/auth", () => ({
  hashPassword: jest.fn(),
}));

jest.mock("../modules/buyer/buyer.service", () => ({
  createBuyerProfile: jest.fn(),
}));

jest.mock("../modules/seller/seller.service", () => ({
  createSellerProfile: jest.fn(),
}));

describe("createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user if no user with the same email exists", async () => {
    (findUserByEmail as jest.Mock).mockResolvedValueOnce(null);
    (hashPassword as jest.Mock).mockResolvedValueOnce("password123");
    (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockUser);
    (createBuyerProfile as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await createUser(mockInput);

    expect(findUserByEmail).toHaveBeenCalledWith(mockInput.email);
    expect(hashPassword).toHaveBeenCalledWith(mockInput.password);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: mockInput.name,
        email: mockInput.email,
        password: "password123",
        roleId: mockInput.roleId,
      },
      include: { role: true },
    });
    expect(createBuyerProfile).toHaveBeenCalledWith({
      email: mockInput.email,
      name: mockInput.name,
    });
    expect(result).toEqual({ ...mockUser });
  });

  it("should throw an error if a user with the same email already exists", async () => {
    (findUserByEmail as jest.Mock).mockResolvedValueOnce({
      id: 1,
      email: "john@example.com",
    });

    await expect(createUser(mockInput)).rejects.toThrow(
      "User with this email already exists",
    );
    expect(hashPassword).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(createBuyerProfile).not.toHaveBeenCalled();
    expect(createSellerProfile).not.toHaveBeenCalled();
  });
});
