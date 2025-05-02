import { PractitionerEntity } from "@/domain/entity/practitioner";
import { inject, injectable } from "tsyringe";
import type { UseCase } from "../use-case";
import { AuthService } from "@/domain/services/auth.service";
import { UseCaseError } from "@/domain/use-cases/use-case";

@injectable()
export class GetPractitionersUseCase implements UseCase<
  void, ReturnType<PractitionerEntity["getPractitioners"]>
> {
  constructor(
    @inject(PractitionerEntity) private practitionerEntity: PractitionerEntity,
    @inject(AuthService) private authService: AuthService,
  ) { }
  async execute() {
    if(!this.authService.isAuthenticated()) {
      throw new UseCaseError('Authentication required', 401);
    }
    if (!this.authService.hasRole("admin")) {
      throw new UseCaseError('Admin access required', 403);
    }
    const records = await this.practitionerEntity.getPractitioners();
    return records;
  }
}
