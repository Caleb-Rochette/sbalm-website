-- Add the new UserRole enum values in their own migration so the next
-- migration (and the User.role default) can reference CUSTOMER/FIELD.
-- Postgres forbids using a freshly-added enum value in the same transaction.
ALTER TYPE "UserRole" ADD VALUE 'FIELD';
ALTER TYPE "UserRole" ADD VALUE 'CUSTOMER';
