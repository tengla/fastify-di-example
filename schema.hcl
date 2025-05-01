table "users" {
  schema = schema.main
  column "id" {
    null           = true
    type           = integer
    auto_increment = true
  }
  column "username" {
    null = false
    type = text
  }
  column "password" {
    null = false
    type = text
  }
  column "email" {
    null = false
    type = text
  }
  column "created_at" {
    null    = true
    type    = sql("timestamp")
    default = sql("CURRENT_TIMESTAMP")
  }
  primary_key {
    columns = [column.id]
  }
}
table "practitioners" {
  schema = schema.main
  column "id" {
    null           = true
    type           = integer
    auto_increment = true
  }
  column "name" {
    null = false
    type = text
  }
  column "email" {
    null = false
    type = text
  }
  column "created_at" {
    null    = true
    type    = sql("timestamp")
    default = sql("CURRENT_TIMESTAMP")
  }
  column "user_id" {
    null = false
    type = integer
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key {
    columns = [column.user_id]
    ref_columns = [table.users.column.id]
    on_delete = "CASCADE"
  }
}
table "patients" {
  schema = schema.main
  column "id" {
    null           = true
    type           = integer
    auto_increment = true
  }
  column "name" {
    null = false
    type = text
  }
  column "email" {
    null = false
    type = text
  }
  column "created_at" {
    null    = true
    type    = sql("timestamp")
    default = sql("CURRENT_TIMESTAMP")
  }
  column "user_id" {
    null = false
    type = integer
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key {
    columns = [column.user_id]
    ref_columns = [table.users.column.id]
    on_delete = "CASCADE"
  }
}
table "appointments" {
  schema = schema.main
  column "id" {
    null           = true
    type           = integer
    auto_increment = true
  }
  column "start_time" {
    null = false
    type = sql("timestamp")
  }
  column "end_time" {
    null = false
    type = sql("timestamp")
  }
  column "patient_id" {
    null = false
    type = integer
  }
  column "practitioner_id" {
    null = false
    type = integer
  }
  column "created_at" {
    null    = false
    type    = sql("timestamp")
    default = sql("CURRENT_TIMESTAMP")
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key {
    columns = [column.patient_id]
    ref_columns = [table.users.column.id]
    on_delete = "CASCADE"
  }
  foreign_key {
    columns = [column.practitioner_id]
    ref_columns = [table.practitioners.column.id]
    on_delete = "CASCADE"
  }
}
table "audits" {
  schema = schema.main
  column "id" {
    null           = true
    type           = integer
    auto_increment = true
  }
  column "user_id" {
    null = true
    type = integer
  }
  column "action" {
    null = false
    type = text
  }
  column "table_name" {
    null = false
    type = text
  }
  column "record_id" {
    null = false
    type = integer
  }
  column "timestamp" {
    null    = false
    type    = sql("timestamp")
    default = sql("CURRENT_TIMESTAMP")
  }
  primary_key {
    columns = [column.id]
  }
}
schema "main" {
}
