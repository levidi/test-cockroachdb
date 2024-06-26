cockroach sql --insecure --host=localhost

-- Conecte-se ao cluster como administrador (geralmente "root" ou outro superusuário)
\c root

-- Crie o banco de dados
CREATE DATABASE mydb;

-- Conecte-se ao banco de dados específico
use mydb;

<!-- CREATE TABLE messages (
    id INT PRIMARY KEY,
    category STRING,
    content TSVECTOR
); -->

CREATE TABLE messages (
    id INT PRIMARY KEY,
    category STRING,
    content STRING
);

-- Criar um índice de texto completo na coluna content usando to_tsvector com o idioma português do Brasil
CREATE INDEX idx_content_gin ON messages USING GIN (to_tsvector('portuguese', content)); ok for TEXT or String

SELECT id, category, content
FROM messages
WHERE content @@ to_tsquery('portuguese', 'inovação');

<!-- CREATE INDEX idx_content_btree ON messages (content) STORING (category); -->

<!-- CREATE INDEX idx_message_content_gin ON messages USING GIN (content); --> ok for TSVECTOR or TEXT[]

<!-- CREATE INDEX idx_content_fulltext ON messages USING GIN (to_tsvector('portuguese_unaccent', content)); -->

SHOW INDEX FROM messages;

<!-- SELECT content FROM messages@idx_content_fulltext WHERE content='contemporâneo'; -->

CREATE INDEX idx_content_fulltext ON messages
USING GIN (to_tsvector('portuguese_unaccent', content));

EXPLAIN ANALYZE
SELECT id, content
FROM messages
WHERE to_tsvector('portuguese', content) @@ to_tsquery('portuguese', 'jesus');

-- Inserir dados na tabela 'messages'
INSERT INTO messages (id, category, content)
    VALUES  (1, 'test', 'Primeiro registro para realização da consulta do tipo full text search'),
            (2, 'test', 'Segundo registro do teste full text search');

select id, category, to_tsvector('portuguese', content) from messages;

SELECT * FROM messages;

DELETE FROM messages WHERE id > 0;

DROP TABLE messages;

SELECT
    n.nspname AS schema_name,
    c.relname AS table_name,
    i.relname AS index_name,
    pg_catalog.pg_get_indexdef(i.oid) AS index_def
FROM
    pg_catalog.pg_class c
JOIN
    pg_catalog.pg_index x ON c.oid = x.indrelid
JOIN
    pg_catalog.pg_class i ON i.oid = x.indexrelid
JOIN
    pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE
    c.relkind = 'r' -- 'r' = ordinary table
ORDER BY
    n.nspname,
    c.relname,
    i.relname;

EXPLAIN ANALYZE SELECT * FROM messages WHERE content ILIKE '%esus%';
