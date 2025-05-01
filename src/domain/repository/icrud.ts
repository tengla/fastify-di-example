import { type Insertable, type Selectable, type Updateable } from "kysely";

export interface CRUDRepository<T> {
  create(item: Insertable<T>): Promise<Selectable<T>>;
  read(id: number): Promise<Selectable<T>>;
  update(id: number, item: Updateable<T>): Promise<Selectable<T> | null>;
  delete(id: number): Promise<boolean>;
  list(): Promise<Selectable<T>[]>;
  findBy(field: keyof T, value: any): Promise<T | null>;
  findAllBy(field: keyof T, value: any): Promise<T[]>;
  count(): Promise<number>;
  exists(id: number): Promise<boolean>;
}