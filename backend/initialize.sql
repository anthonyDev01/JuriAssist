CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "messages" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    owner TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES "user"(id)
);

CREATE TYPE activity_type AS ENUM ('upload', 'chat', 'insight', 'delete');

CREATE TABLE "activity" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type activity_type NOT NULL,
    description TEXT NOT NULL,
    document_name TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user_activity FOREIGN KEY(user_id) REFERENCES "user"(id)
);
