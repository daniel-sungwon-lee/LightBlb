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

CREATE TABLE "saved" (
  "postId" serial NOT NULL,
  "userId" serial NOT NULL,
  UNIQUE ("postId", "userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "comments" (
	"commentId" serial NOT NULL,
	"postId" serial NOT NULL,
	"userId" serial NOT NULL,
	"comment" TEXT NOT NULL,
	CONSTRAINT "comments_pk" PRIMARY KEY ("commentId")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "saved" ADD CONSTRAINT "saved_fk0" FOREIGN KEY ("postId") REFERENCES "posts"("postId");
ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("postId") REFERENCES "posts"("postId");
