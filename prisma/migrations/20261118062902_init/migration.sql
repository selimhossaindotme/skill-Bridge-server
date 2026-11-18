-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" TEXT DEFAULT 'student',
ADD COLUMN     "status" TEXT DEFAULT 'active';
