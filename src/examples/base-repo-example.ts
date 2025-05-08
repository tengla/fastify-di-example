import "reflect-metadata/lite";
import { container } from "tsyringe";
import { PractitionersRepository } from "@/domain/repository/practitioners";
import { UsersRepository } from "@/domain/repository/users";

async function main() {
  // Resolve repositories from container
  const practitionersRepo = container.resolve(PractitionersRepository);
  const usersRepo = container.resolve(UsersRepository);
  
  try {
    // Create a user
    const user = await usersRepo.create({
      email: "john.doe@example.com",
      username: "johndoe",
      password: "password123"
    });
    
    console.log("Created user:", user);
    
    // Create a practitioner linked to the user
    const practitioner = await practitionersRepo.create({
      name: "Dr. John Doe",
      email: "john.doe@clinic.com",
      user_id: user.id!
    });
    
    console.log("Created practitioner:", practitioner);
    
    // Demonstrate finding by email
    const foundPractitioner = await practitionersRepo.findBy("email", "john.doe@clinic.com");
    console.log("Found practitioner by email:", foundPractitioner);
    
    // Demonstrate updating a record
    const updatedPractitioner = await practitionersRepo.update(
      practitioner.id!, 
      { name: "Dr. John Smith" }
    );
    console.log("Updated practitioner:", updatedPractitioner);
    
    // Demonstrate listing all practitioners
    const practitioners = await practitionersRepo.list();
    console.log("All practitioners:", practitioners);
    
    // Clean up (delete the created records)
    await practitionersRepo.delete(practitioner.id!);
    await usersRepo.delete(user.id!);
    console.log("Deleted test records");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

main();