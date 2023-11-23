create database webServer;
use webServer;

create table Login(id int primary key auto_increment, username varchar(30) not null, email varchar(50) unique not null, passHash varchar(40) not null);
