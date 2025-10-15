# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Digital Health Competency Framework (DHLF) database project for the World Bank. The project contains structured data about digital health competencies, roles, and performance criteria organized in a relational database format.

## Project Structure

- `DHLF-data/` - Contains CSV data files and SQL schema for the competency framework
  - `competencies.csv` - Digital health competencies with codes and statements
  - `domains.csv` - High-level competency domains
  - `subdomains.csv` - Subdomain classifications within domains
  - `performance_criteria.csv` - Performance criteria for each competency
  - `roles.csv` - Professional roles in digital health
  - `role_competencies.csv` - Mapping between roles and required competencies
  - `create_database.sql` - Complete database schema with table definitions

## Database Schema

The database follows a hierarchical structure:
- Domains → Subdomains → Competencies → Performance Criteria
- Roles are mapped to competencies through the role_competencies junction table
- All tables use UUID primary keys and include audit timestamps
- Schema supports PostgreSQL/SQLite with proper foreign key relationships

## Dependencies

- `better-sqlite3` - SQLite database driver for Node.js

## Data Structure Notes

- All competencies are hierarchically coded (e.g., 1.1.1, 1.2.1)
- UUIDs are used for all primary keys to ensure data integrity
- Role types include: Government, Other (private sector, academia, etc.)
- The framework covers ethical, technical, and operational aspects of digital health

## Development Guidelines

### Versioning
All code files must include version numbers using semantic versioning:
- Major versions (e.g., 1.0.0) for new features or significant changes
- Minor versions (e.g., 1.1.0) for enhancements and minor additions
- Patch versions (e.g., 1.1.1) for bug fixes and small corrections