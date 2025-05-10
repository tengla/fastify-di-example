import { db } from "@/packages/database";
import { type DB } from "@/generated/db.d";
import { DeleteResult, sql, type Insertable, type Selectable, type Updateable } from "kysely";
import { type CRUDRepository } from "./icrud";

/**
 * BaseRepository provides a generic implementation of the CRUDRepository interface
 * It uses explicit sql fragments and type assertions to work around Kysely's typing limitations
 * while maintaining type safety for the API consumers
 */
export abstract class BaseRepository<T extends keyof DB> implements CRUDRepository<DB[T]> {
  constructor(protected readonly tableName: T) {}

  async create(item: Insertable<DB[T]>): Promise<Selectable<DB[T]>> {
    // Using SQL fragment to avoid type issues with dynamic table names
    const result = await db
      .insertInto(this.tableName)
      .values(item)
      .returningAll()
      .executeTakeFirstOrThrow();
    return result as Selectable<DB[T]>;
  }

  async read(id: number): Promise<Selectable<DB[T]>> {
    // Using SQL fragment for the id column reference
    const result = await db
      .selectFrom(this.tableName)
      .selectAll()
      .where(sql.raw(`${String(this.tableName)}.id`), "=", id)
      .executeTakeFirst();

    if (!result) {
      throw new Error(`${String(this.tableName)} with id ${id} not found`);
    }
    
    return result as Selectable<DB[T]>;
  }

  async update(id: number, item: Updateable<DB[T]>): Promise<Selectable<DB[T]> | null> {
    // Using SQL fragment for the id column reference and type assertion for item
    const updated = await db
      .updateTable(this.tableName)
      .set(item as any)
      .where(sql.raw(`${String(this.tableName)}.id`), "=", id)
      .returningAll()
      .executeTakeFirst();
    
    if (!updated) {
      return null;
    }
    
    return updated as Selectable<DB[T]>;
  }

  async list(): Promise<Selectable<DB[T]>[]> {
    const results = await db
      .selectFrom(this.tableName)
      .selectAll()
      .execute();
    
    // Convert to unknown first to avoid type overlap error
    return results as unknown as Selectable<DB[T]>[];
  }

  async delete(id: number): Promise<DeleteResult[]> {
    // Using SQL fragment for the id column reference
    return db
      .deleteFrom(this.tableName)
      .where(sql.raw(`${String(this.tableName)}.id`), "=", id)
      .execute();
  }

  async deleteAll(): Promise<boolean> {
    await db.deleteFrom(this.tableName).execute();
    return true;
  }

  async findBy(field: keyof DB[T], value: any): Promise<Selectable<DB[T]> | null> {
    // Using SQL fragment to avoid type issues with dynamic field names
    const result = await db
      .selectFrom(this.tableName)
      .selectAll()
      .where(sql.raw(`${String(this.tableName)}.${String(field)}`), "=", value)
      .executeTakeFirst();
    
    return result as Selectable<DB[T]> | null;
  }

  async findAllBy(field: keyof DB[T], value: any): Promise<Selectable<DB[T]>[]> {
    // Using SQL fragment to avoid type issues with dynamic field names
    const results = await db
      .selectFrom(this.tableName)
      .selectAll()
      .where(sql.raw(`${String(this.tableName)}.${String(field)}`), "=", value)
      .execute();
    
    // Convert to unknown first to avoid type overlap error
    return results as unknown as Selectable<DB[T]>[];
  }

  async count(): Promise<{ count: string | number | bigint }> {
    const result = await db
      .selectFrom(this.tableName)
      .select(db.fn.count(sql.raw(`${String(this.tableName)}.id`)).as("count"))
      .executeTakeFirst();
    
    if (!result) {
      throw new Error("No result found");
    }
    
    return result;
  }

  async exists(id: number): Promise<boolean> {
    // Using SQL fragment for the id column reference
    const result = await db
      .selectFrom(this.tableName)
      .select(sql.raw(`${String(this.tableName)}.id`).as('id'))
      .where(sql.raw(`${String(this.tableName)}.id`), "=", id)
      .executeTakeFirst();
    
    return !!result;
  }
}