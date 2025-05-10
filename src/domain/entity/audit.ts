import { inject, injectable } from "tsyringe";
import { AuditsRepository } from "@/domain/repository/audits";

export type Action = "INSERT" | "UPDATE" | "DELETE";

@injectable()
export class AuditEntity {
  constructor(
    @inject(AuditsRepository) private auditsRepository: AuditsRepository
  ) {}
  async log(
    action: Action,
    table_name: string,
    record_id: number,
    user_id: number | null = null
  ) {
    const record = await this.auditsRepository.create({
      action,
      table_name,
      record_id,
      user_id,
    });
    return `Audit Entry(${record.id}) - Action: ${record.action}, Table: ${record.table_name}, Record ID: ${record_id}, User ID: ${user_id}, Timestamp: ${record.timestamp}`;
  }
}
