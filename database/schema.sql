CREATE TABLE "users" (
	"userId" serial NOT NULL,
	"email" TEXT NOT NULL,
	"hashedPassword" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "posts" (
  "postId" serial NOT NULL,
  "userId" serial NOT NULL,
  "content" TEXT NOT NULL,
  CONSTRAINT "posts_pk" PRIMARY KEY ("postId")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
