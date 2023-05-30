MIGRATION_FILENAME ?= $(shell bash -c 'read -p "Filename: " migration_filename; echo $$migration_filename')
.PHONY: migration
migration:
	@npx sequelize-cli migration:generate --name $(MIGRATION_FILENAME)

.PHONY: db-up
db-up:
	@npx sequelize-cli db:migrate

.PHONY: db-down
db-down:
	@npx sequelize-cli db:migrate:undo