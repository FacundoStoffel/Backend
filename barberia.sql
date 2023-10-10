CREATE TABLE TIPO_CORTE
(
  id_corte INT AUTO_INCREMENT NOT NULL,
  corte_tipo VARCHAR(50) UNIQUE NOT NULL,
  precio INT NOT NULL,
  PRIMARY KEY (id_corte)
);

CREATE TABLE METODO_PAGO
(
  id_pago INT AUTO_INCREMENT NOT NULL,
  metodo VARCHAR(50) UNIQUE NOT NULL,
  PRIMARY KEY (id_pago)
);

CREATE TABLE ROL
(
  id_rol INT AUTO_INCREMENT NOT NULL,
  nombre_rol VARCHAR(50) UNIQUE NOT NULL,
  PRIMARY KEY (id_rol)
);

CREATE TABLE HORARIO
(
  hora VARCHAR(20) NOT NULL,
  PRIMARY KEY (hora)
);

CREATE TABLE USUARIO
(
  id_usuario INT AUTO_INCREMENT NOT NULL,
  nombre VARCHAR(40) NOT NULL,
  apellido VARCHAR(40) NOT NULL,
  mail VARCHAR(50) UNIQUE NOT NULL,
  contrasena VARCHAR(200) NOT NULL,
  id_rol INT  NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_rol) REFERENCES ROL(id_rol)
);

CREATE TABLE RESERVAS
(
  id_reserva INT AUTO_INCREMENT NOT NULL,
  fecha DATE NOT NULL,
  hora VARCHAR(20) NOT NULL,
  id_usuario INT  NOT NULL,
  id_corte INT  NOT NULL,
  id_pago INT  NOT NULL,
  cancelada BOOLEAN NOT NULL,
  PRIMARY KEY (id_reserva),
  FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
  FOREIGN KEY (id_corte) REFERENCES TIPO_CORTE(id_corte),
  FOREIGN KEY (hora) REFERENCES HORARIO(hora),
  FOREIGN KEY (id_pago) REFERENCES METODO_PAGO(id_pago)
);