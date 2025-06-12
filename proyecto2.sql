CREATE DATABASE citasMedicas;
USE citasMedicas;


CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL, -- 'ADMIN', 'MEDICO', 'PACIENTE'
    aprobado BOOLEAN DEFAULT FALSE,
    especialidad VARCHAR(100),
    costo_consulta DOUBLE,
    localidad VARCHAR(100),
    foto VARCHAR(255),
    presentacion TEXT
);



CREATE TABLE horarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medico_id BIGINT NOT NULL,
    dia_semana VARCHAR(20) NOT NULL, -- 'LUNES', 'MARTES', ...
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    frecuencia INT NOT NULL,
    FOREIGN KEY (medico_id) REFERENCES usuarios(id)
);


CREATE TABLE citas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fechahora DATETIME NOT NULL,
    estado VARCHAR(20) NOT NULL, -- 'PENDIENTE', 'ATENDIDA', etc.
    anotaciones TEXT,
    medico_id BIGINT NOT NULL,
    paciente_id BIGINT NOT NULL,
    FOREIGN KEY (medico_id) REFERENCES usuarios(id),
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id)
);





SELECT * FROM usuarios WHERE rol = 'ADMIN';

SELECT * FROM usuario;
SELECT * FROM cita;
SELECT * FROM horario;


SELECT * FROM usuarios;
SELECT * FROM cita;
SELECT * FROM horarios;


ALTER TABLE usuarios DROP COLUMN primer_ingreso;


INSERT INTO usuario (nombre, username, clave, rol, aprobado, primer_ingreso)
VALUES (
  'Administrador',
  'admin',
  '$2a$10$VzyzNYeLFPfPJ3auOU7ZrOCp7PW3La9H7ftEDBEoNFtNLbeZzHsvi', -- admin123
  'ADMIN',
  true,
  false
);

ALTER TABLE usuarios ADD COLUMN primer_ingreso BOOLEAN NOT NULL DEFAULT true;

SELECT username, clave FROM usuarios WHERE id = 10;





UPDATE usuario SET primer_ingreso = false WHERE rol = 'ADMIN' OR rol = 'PACIENTE';


DELETE FROM usuario;
DELETE FROM horario;
DELETE FROM cita;

DELETE FROM horario WHERE medico_id = 10;

ALTER TABLE usuarios
ADD COLUMN dia_inicio_trabajo VARCHAR(20),
ADD COLUMN dia_fin_trabajo VARCHAR(20);

SELECT id, username, clave, rol FROM usuarios WHERE username = 'admin';

UPDATE usuario SET aprobado = true WHERE username = 'admin';





SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE citas;
TRUNCATE TABLE horarios;
TRUNCATE TABLE usuarios;

SET FOREIGN_KEY_CHECKS = 1;

