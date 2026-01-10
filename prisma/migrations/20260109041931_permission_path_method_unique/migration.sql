CREATE UNIQUE INDEX permission_path_method_unique
ON "permissions" (path, method)
WHERE "deleted_at" IS NULL;