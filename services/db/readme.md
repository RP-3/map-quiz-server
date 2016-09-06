POSTGRES:
CREATE DATABASE mapquiz;
\c mapquiz
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

sudo npm install -g knex
knex migrate:latest --env dev
knex seed:run --env dev





knex migrate:rollback --env dev
