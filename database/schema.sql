CREATE DATABASE IF NOT EXISTS hospital_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hospital_management;

CREATE TABLE doctors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_doctors_license_number (license_number),
  UNIQUE KEY uq_doctors_email (email)
) ENGINE=InnoDB;

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'DOCTOR', 'LAB') NOT NULL,
  doctor_id BIGINT UNSIGNED NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_doctor_id (doctor_id),
  CONSTRAINT fk_users_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE patients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  date_of_birth DATE NULL,
  age TINYINT UNSIGNED NULL,
  gender ENUM('MALE', 'FEMALE', 'OTHER') NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NULL,
  address VARCHAR(500) NULL,
  blood_group VARCHAR(10) NULL,
  allergies TEXT NULL,
  emergency_contact VARCHAR(20) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_patients_name (name),
  KEY idx_patients_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE appointments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id BIGINT UNSIGNED NOT NULL,
  doctor_id BIGINT UNSIGNED NOT NULL,
  appointment_date DATETIME NOT NULL,
  status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED')
    NOT NULL DEFAULT 'SCHEDULED',
  reason TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_appointments_patient (patient_id),
  KEY idx_appointments_doctor_date (doctor_id, appointment_date),
  CONSTRAINT fk_appointments_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_appointments_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE prescriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  appointment_id BIGINT UNSIGNED NOT NULL,
  patient_id BIGINT UNSIGNED NOT NULL,
  doctor_id BIGINT UNSIGNED NOT NULL,
  diagnosis TEXT NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_prescriptions_appointment (appointment_id),
  KEY idx_prescriptions_patient (patient_id),
  KEY idx_prescriptions_doctor (doctor_id),
  CONSTRAINT fk_prescriptions_appointment
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_prescriptions_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_prescriptions_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE prescription_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  prescription_id BIGINT UNSIGNED NOT NULL,
  medicine_name VARCHAR(200) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  instructions TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_prescription_items_prescription (prescription_id),
  CONSTRAINT fk_prescription_items_prescription
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE lab_reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id BIGINT UNSIGNED NOT NULL,
  test_name VARCHAR(200) NOT NULL,
  notes TEXT NULL,
  storage_type ENUM('LOCAL', 'S3') NOT NULL,
  local_path VARCHAR(1000) NULL,
  s3_key VARCHAR(1000) NULL,
  original_file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by BIGINT UNSIGNED NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lab_reports_patient (patient_id),
  KEY idx_lab_reports_uploaded_by (uploaded_by),
  CONSTRAINT fk_lab_reports_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_lab_reports_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_lab_reports_storage CHECK (
    (storage_type = 'LOCAL' AND local_path IS NOT NULL AND s3_key IS NULL)
    OR
    (storage_type = 'S3' AND s3_key IS NOT NULL AND local_path IS NULL)
  )
) ENGINE=InnoDB;
