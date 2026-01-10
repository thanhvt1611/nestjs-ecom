-- AlterTable
ALTER TABLE "brand_translations" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "category_translations" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "languages" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "product_translations" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "skus" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "user_translations" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "variant_options" ADD COLUMN     "deleted_by_id" INTEGER;

-- AlterTable
ALTER TABLE "variants" ADD COLUMN     "deleted_by_id" INTEGER;

-- CreateIndex
CREATE INDEX "variants_deleted_at_idx" ON "variants"("deleted_at");

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_translations" ADD CONSTRAINT "user_translations_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_translations" ADD CONSTRAINT "product_translations_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variants" ADD CONSTRAINT "variants_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_options" ADD CONSTRAINT "variant_options_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skus" ADD CONSTRAINT "skus_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_translations" ADD CONSTRAINT "brand_translations_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_deleted_by_id_fkey" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
