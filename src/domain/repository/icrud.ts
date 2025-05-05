import { DeleteResult, type Insertable, type Selectable, type Updateable } from "kysely";

export interface CRUDRepository<T> {
  create(item: Insertable<T>): Promise<Selectable<T>>;
  read(id: number): Promise<Selectable<T>>;
  update(id: number, item: Updateable<T>): Promise<Selectable<T> | null>;
  delete(id: number): Promise<DeleteResult[]>;
  list(): Promise<Selectable<T>[]>;
  findBy(field: keyof T, value: any): Promise<Selectable<T> | null>;
  findAllBy(field: keyof T, value: any): Promise<Selectable<T>[]>;
  count(): Promise<{ count: string | number | bigint }>;
  exists(id: number): Promise<boolean>;
}