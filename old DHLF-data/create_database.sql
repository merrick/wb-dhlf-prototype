-- Digital Health Competency Framework Database Schema
-- Generated automatically from Excel transformation
-- Script Version: 2.2.0
-- Generated on: 2025-07-31 17:10:31

-- Create domains table
CREATE TABLE domains (
    domain_id UUID PRIMARY KEY,
    domain_code VARCHAR(10) NOT NULL UNIQUE,
    domain_name VARCHAR(255) NOT NULL,
    domain_title VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subdomains table
CREATE TABLE subdomains (
    subdomain_id UUID PRIMARY KEY,
    domain_id UUID NOT NULL REFERENCES domains(domain_id),
    subdomain_code VARCHAR(20) NOT NULL UNIQUE,
    subdomain_name VARCHAR(255) NOT NULL,
    subdomain_title VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create competencies table
CREATE TABLE competencies (
    competency_id UUID PRIMARY KEY,
    subdomain_id UUID NOT NULL REFERENCES subdomains(subdomain_id),
    competency_code VARCHAR(30) NOT NULL UNIQUE,
    competency_title TEXT NOT NULL,
    competency_statement TEXT,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create performance_criteria table
CREATE TABLE performance_criteria (
    criteria_id UUID PRIMARY KEY,
    competency_id UUID NOT NULL REFERENCES competencies(competency_id),
    criteria_text TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE roles (
    role_id UUID PRIMARY KEY,
    role_code INTEGER NOT NULL UNIQUE,
    role_title VARCHAR(255) NOT NULL,
    role_type VARCHAR(100) NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_competencies table (junction table for many-to-many relationship)
CREATE TABLE role_competencies (
    role_competency_id UUID PRIMARY KEY,
    role_id UUID NOT NULL REFERENCES roles(role_id),
    competency_id UUID NOT NULL REFERENCES competencies(competency_id),
    proficiency_level VARCHAR(50) NOT NULL DEFAULT 'Required',
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(role_id, competency_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_subdomains_domain_id ON subdomains(domain_id);
CREATE INDEX idx_competencies_subdomain_id ON competencies(subdomain_id);
CREATE INDEX idx_performance_criteria_competency_id ON performance_criteria(competency_id);
CREATE INDEX idx_role_competencies_role_id ON role_competencies(role_id);
CREATE INDEX idx_role_competencies_competency_id ON role_competencies(competency_id);
CREATE INDEX idx_domains_sort_order ON domains(sort_order);
CREATE INDEX idx_subdomains_sort_order ON subdomains(sort_order);
CREATE INDEX idx_competencies_sort_order ON competencies(sort_order);
CREATE INDEX idx_performance_criteria_sort_order ON performance_criteria(sort_order);
CREATE INDEX idx_roles_type ON roles(role_type);
CREATE INDEX idx_roles_code ON roles(role_code);

-- Sample queries for testing

-- Get all competencies for Ethics and Equity domain
SELECT 
    d.domain_title,
    s.subdomain_title,
    c.competency_code,
    c.competency_title
FROM domains d
JOIN subdomains s ON d.domain_id = s.domain_id
JOIN competencies c ON s.subdomain_id = c.subdomain_id
WHERE d.domain_code = '1.0'
ORDER BY s.sort_order, c.sort_order;

-- Get competency with performance criteria
SELECT 
    c.competency_code,
    c.competency_title,
    pc.criteria_text
FROM competencies c
LEFT JOIN performance_criteria pc ON c.competency_id = pc.competency_id
WHERE c.competency_code = '2.1.1'
ORDER BY pc.sort_order;

-- Count competencies by domain
SELECT 
    d.domain_title,
    COUNT(c.competency_id) as competency_count
FROM domains d
JOIN subdomains s ON d.domain_id = s.domain_id
JOIN competencies c ON s.subdomain_id = c.subdomain_id
GROUP BY d.domain_id, d.domain_title
ORDER BY d.sort_order;

-- Get all roles by type
SELECT 
    role_type,
    role_title,
    role_description
FROM roles
ORDER BY role_type, role_title;

-- Count roles by type
SELECT 
    role_type,
    COUNT(*) as role_count
FROM roles
GROUP BY role_type
ORDER BY role_count DESC;
