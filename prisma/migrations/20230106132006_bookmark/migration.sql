-- CreateTable

CREATE TABLE
    "Users" (
        "id" SERIAL NOT NULL,
        "creatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "email" TEXT NOT NULL,
        "hash" TEXT NOT NULL,
        "firstname" TEXT,
        "lastname" TEXT,
        CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
    );

-- CreateTable

CREATE TABLE
    "Bookmark" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "link" TEXT,
        CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex

CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");