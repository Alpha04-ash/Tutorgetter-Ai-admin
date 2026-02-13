-- Create Users Table
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create Categories Table
CREATE TABLE IF NOT EXISTS "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Create Questions Table
CREATE TABLE IF NOT EXISTS "questions" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'ADMIN',
    "type" TEXT NOT NULL DEFAULT 'THEORY',
    "metadataJson" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- Create Assessments Table
CREATE TABLE IF NOT EXISTS "assessments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "finalScore" DOUBLE PRECISION,
    "technicalScore" DOUBLE PRECISION,
    "teachingScore" DOUBLE PRECISION,
    "communicationScore" DOUBLE PRECISION,
    "decision" TEXT,
    "videoUrl" TEXT,
    "candidateNameSnapshot" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- Create Answers Table
CREATE TABLE IF NOT EXISTS "answers" (
    "id" SERIAL NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answerText" TEXT NOT NULL,
    "transcript" TEXT,
    "aiFeedback" TEXT,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- Create Indexes and Unique Constraints
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- Add Foreign Keys
ALTER TABLE "questions" ADD CONSTRAINT "questions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "assessments" ADD CONSTRAINT "assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "answers" ADD CONSTRAINT "answers_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed Initial Categories (Optional but recommended)
INSERT INTO "categories" ("name", "description") VALUES 
('Python', 'Core Python programming concepts and advanced topics'),
('React', 'Frontend development with React.js library'),
('JavaScript', 'Modern JavaScript (ES6+) and web fundamentals')
ON CONFLICT ("name") DO NOTHING;
