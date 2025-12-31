-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- Users Table
-- =========================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- Calculation Nodes Table
-- =========================
CREATE TABLE calculation_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Tree relations
    root_id UUID NOT NULL,
    parent_id UUID NULL,

    -- Math data
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('START', 'ADD', 'SUB', 'MUL', 'DIV')),
    input_value DOUBLE PRECISION NOT NULL,
    calculated_value DOUBLE PRECISION NOT NULL,

    -- Author
    user_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_parent
        FOREIGN KEY (parent_id)
        REFERENCES calculation_nodes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_root
        FOREIGN KEY (root_id)
        REFERENCES calculation_nodes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- Indexes for Performance
-- =========================
CREATE INDEX idx_calculation_nodes_root_id
    ON calculation_nodes(root_id);

CREATE INDEX idx_calculation_nodes_parent_id
    ON calculation_nodes(parent_id);

CREATE INDEX idx_calculation_nodes_user_id
    ON calculation_nodes(user_id);
