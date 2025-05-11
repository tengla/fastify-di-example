import { AuditEntity } from "@/domain/entity/audit";
import { Logger } from "./logger.service";

export abstract class BaseService {
  constructor(
    private audit: AuditEntity,
    private logger: typeof Logger
  ) { }

  // Protocol method that handles audit events
  protected async emitAudit(data: { action: string; table_name: string, record_id: number }) {
    // Get user context from current request scope
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.logger?.warn("No user context available for audit");
      return;
    }
    // Add user context to audit data
    const res = await this.audit.log(
      data.action as "INSERT" | "UPDATE" | "DELETE",
      data.table_name,
      data.record_id,
      userId
    );
    this.logger?.info(res);
  }

  // Can be overridden by subclasses if needed
  protected getCurrentUserId(): number | null {
    return null; // Default implementation
  }
}