import "reflect-metadata/lite";
import { container, injectable, inject } from "tsyringe";
import { Audited, type UserProvider } from "@/packages/decorators/audit.decorator";
import { AuthService } from "@/domain/services/auth.service";
import { AuthUserEntity } from "@/domain/entity/auth-user";

// Example repository
@injectable()
class UserRepository {
  tableName = "users";
  
  async findById(id: number) {
    // Simulate database query
    return { id, name: "Example User", email: "user@example.com" };
  }

  @Audited(
    "INSERT",
    (result) => result.id,
    (action, data) => console.log(action, data)
  )
  async create(data: { name: string; email: string }) {
    // Simulate database insert
    const id = Math.floor(Math.random() * 1000);
    const user = { id, ...data };

    console.log("Created user:", user);
    return user;
  }

  @Audited(
    "UPDATE",
    (result) => result.id,
    (action, data) => console.log(action, data)
  )
  async update(id: number, data: Partial<{ name: string; email: string }>) {
    // Simulate database update
    const user = { id, ...data };

    console.log("Updated user:", user);
    return user;
  }

  @Audited(
    "DELETE",
    (id) => id,
    (action, data) => console.log(action, data)
  )
  async delete(id: number) {
    // Simulate database delete
    console.log("Deleted user with ID:", id);
    return id;
  }
}

// Custom user provider example (if you want to get the user from a different source)
class CustomUserProvider implements UserProvider {
  constructor(private apiKey: string) { }

  async getCurrentUserId(): Promise<number | null> {
    // In a real app, this might validate an API key or use a different auth method
    console.log("Using custom user provider with API key:", this.apiKey);

    // Return a hardcoded user ID for demo purposes
    return 9999;
  }
}

@injectable()
class UserService {
  userProvider: UserProvider = {
    getCurrentUserId: async () => {
      return this.authService.isAuthenticated() ? this.authService.user.id : null;
    }
  };
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(AuthService) private authService: AuthService
  ) {}

  // Standard usage with default user provider (AuthService)
  async createUser(data: { name: string; email: string }) {
    return this.userRepository.create(data);
  }

  // Using a custom user provider
  @Audited(
    "UPDATE",
    (result) => result.id,
    (action, data) => console.log(action, data)
  )
  async updateUserWithApiKey(id: number, data: Partial<{ name: string; email: string }>) {
    return this.userRepository.update(id, data);
  }
}

// Main execution
async function main() {
  // Register the AuthService with a mock user
  container.registerInstance(
    AuthService,
    new AuthService(
      new AuthUserEntity({
        id: 1,
        email: "jane@example.com",
        role: "admin"
      })
    )
  )

  // Create an instance of UserService
  const userService = container.resolve(UserService);

  // Create a user (uses default user provider - AuthService)
  const user = await userService.createUser({
    name: "John Doe",
    email: "john@example.com"
  });

  // Update a user with a custom user provider
  await userService.updateUserWithApiKey(user.id, {
    name: "John Updated"
  });

  // Access the repository directly
  const userRepository = container.resolve(UserRepository);

  // Delete a user (uses default user provider)
  await userRepository.delete(user.id);
}

main().catch(console.error);