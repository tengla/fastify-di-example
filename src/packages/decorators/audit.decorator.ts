import type { BaseService } from "@/domain/services/base.service";
import EventEmitter from "node:events";

/**
 * Type of audit action being performed
 */
type AuditAction = "READ" | "INSERT" | "UPDATE" | "DELETE";

/**
 * Interface for a service that can provide the current user's ID
 * This makes the decorator more flexible and not dependent on a specific implementation
 */
export interface UserProvider {
  /**
   * Returns the current user's ID or null if not authenticated
   */
  getCurrentUserId(): Promise<number | null>;
}

export type AuditRecord = {
  table_name: string;
  record_id: string | number;
  user_id: string | number | null | undefined;
  method_name: string;
};

/**
 * A decorator that audits method calls
 *
 * @param action The audit action (INSERT, UPDATE, DELETE)
 * @param getRecordId Function to extract the record ID from the method result
 * @param userProvider Optional custom provider for getting the current user ID
 */
export function Audited<IdType>(
  action: AuditAction,
  getRecordId: (result: IdType) => number | string,
  sendAudit: (action: string, data: AuditRecord) => void
) {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // Get the table name from the context (if available)
      const ctx = this as {
        tableName?: string;
        userProvider?: UserProvider;
      };

      // Check if the original method is a promise function or regular function
      const isAsyncFunction = Object.prototype.toString.call(originalMethod) === "[object AsyncFunction]";
      const isPromise = isAsyncFunction || Object.prototype.toString.call(originalMethod) === "[object Promise]";
      if (!isPromise) {
        console.warn(`Method ${propertyKey} is not asynchronous. Auditing may not work as expected.`);
      }
      const result = await originalMethod.apply(this, args);
      try {
        // Extract record ID from result
        const recordId = getRecordId(result);

        // Use the provided user provider or the default one
        if (!Object.prototype.hasOwnProperty.call(ctx, "userProvider")) {
          console.warn(`Class ${ctx.constructor.name} does not have an userProvider attached.`);
          console.warn("This is a problem, because it is needed to get the userId for audit");
        }
        const userId = await ctx.userProvider?.getCurrentUserId()

        // Determine table name (from context or class name)
        const tableName = ctx.tableName || this.constructor.name;

        // Create audit record
        sendAudit(action, {
          table_name: tableName,
          record_id: recordId,
          user_id: userId,
          method_name: String(propertyKey)
        });
      } catch (error) {
        // Log error but don't block the original method result
        console.error("Failed to create audit record:", error);
      }
      return result;
    };

    return descriptor;
  };
}

export function Audit<IdType>(
  action: AuditAction,
  getRecordId: (result: IdType) => number | string
) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(this: { emitAudit?: (data: any) => void; tableName?: string }, ...args: any[]) {
      // Execute the original method
      const result = await originalMethod.apply(this, args);
      
      // Check if class implements our protocol
      if (this.emitAudit && typeof this.emitAudit === 'function') {
        const auditData = {
          action,
          table_name: this.tableName || target.constructor.name,
          record_id: getRecordId(result),
          method_name: propertyKey,
          timestamp: new Date()
        };
        
        // Delegate audit handling to the class's protocol method
        this.emitAudit(auditData);
      } else {
        console.warn(`Class ${target.constructor.name} does not implement the audit protocol.`);
      }
      
      return result;
    };
  };
}