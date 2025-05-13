-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('upload', 'chat', 'insight');

-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "documentName" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
