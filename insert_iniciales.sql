create database barberia;

insert into usuario(mail,nombre,contrasena,apellido,id_rol) values
('facu@gmail.com','Facu','1234','Stoffel',1) 

insert into rol(nombre_rol)values ('Admin')
insert into rol(nombre_rol)values ('Cliente')

insert into tipo_corte(corte_tipo, precio) values
('corte','1500'),('barba','500'),('corte_barba','2000')

insert into metodo_pago(metodo) values
('efectivo'), ('tarjeta')

insert into horario(hora) values
('08:00'),('08:30'),('09:00'),('09:30'),('10:00'),('10:30'),('11:00'),('11:30'),('12:00'),
('15:00'),('15:30'),('16:00'),('16:30'),('17:00'),('17:30'),('18:00'),('18:30'),
('19:00'),('19:30'),('20:00'),('20:30')

select * from usuario
select * from rol
select * from tipo_corte
select * from metodo_pago
select * from horario

-- create database barberia