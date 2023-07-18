create database pbl;
use pbl;

select * from citizen;
select * from citizen_role;
select * from appointment;
select * from family;
select * from location;
select * from notification;
select * from notification_citizens;
select * from opinion;
select * from politician;
select * from politician_seq;
select * from requirement;
select * from requirement_recipient;
select * from sequence;
select * from token;

drop table token;
ALTER TABLE citizens ADD COLUMN status int default 1;
ALTER TABLE politicians drop COLUMN role;
ALTER TABLE citizen change COLUMN numberCCCD numberCCCD bigint auto_increment;
ALTER TABLE citizen_role change COLUMN role role int; 
ALTER TABLE citizens MODIFY COLUMN email varchar(255) ;
ALTER TABLE citizens MODIFY COLUMN militaryService bit default 0;
ALTER TABLE locations change COLUMN appointment_date appointmentDate date; 
drop table appointment;
create table appointment (
	apointmentId int auto_increment primary key,
    appointmentKey date ,
    description nvarchar(255),
    endTime varchar(255),
    startTime varchar(255),
    status int,
    citizenId int,
    policitianId int,
    foreign key (citizenId) REFERENCES citizen(citizenId),
    foreign key (policitianId) REFERENCES policitianId(citizenId)
    
);

ALTER TABLE citizens
ADD CONSTRAINT FOREIGN KEY (idLocation) REFERENCES locations (idLocation);


ALTER TABLE appointment DROP FOREIGN KEY FKpvko6lesqchwpnt731mrflijx;
ALTER TABLE citizen_role DROP FOREIGN KEY FK47xkuk920h7urhkbm1twi4mxv;
ALTER TABLE citizens DROP FOREIGN KEY citizens_ibfk_1;




create table family (
	idFamily int auto_increment primary key,
    idFamilyCitizen int,
    FOREIGN KEY (idFamilyCitizen) REFERENCES citizen(idFamily)
);

delete from locations where idLocation= 5;
delete from citizens where idCitizen= 192001822;

-- ----------------------------------------------
create database CMS;
drop database CMS;
use CMS;

select * from citizens;
select * from citizen_role;
select * from appointments;
select * from locations;
select * from notifications;
select * from notification_citizen;
select * from opinions;
select * from politicians;
select * from requirements;


ALTER TABLE citizens AUTO_INCREMENT = 192001821;
create table citizens(
	idCitizen bigint auto_increment primary key,
    password varchar(255),
    salt varchar(255),
    name nvarchar(255),
    birth date,
    gender bit,
    address nvarchar(255),
    idLocation int, 
    idFamily int, 
    email varchar(255),
    phone varchar(255),
    profession nvarchar(255),
    ethnic nvarchar(255),
    religion nvarchar(255),
    married bit default false,
    militaryService bit default false,
    homeOwnerRelationship nvarchar(255),
    criminalRecord nvarchar(255),
    role int
);


create table politicians (
	idPolitician int auto_increment primary key,
    areaManagement nvarchar(255),
    levelManagement int,
    position nvarchar(255),
    idCitizen bigint,
	foreign key (idCitizen) references citizens(idCitizen)
);

create table appointments (
	idAppointment int auto_increment primary key,
    appointmentDate date,
    startTime varchar(255),
    endTime varchar(255),
    status int default 1,
    idCitizen bigint,
    idPolitician int,
    description nvarchar(255),
    foreign key (idCitizen) references citizens(idCitizen),
    foreign key (idPolitician) references politicians(idPolitician)
);
create table locations (
	idLocation int primary key auto_increment,
    city nvarchar(255),
    district nvarchar(255),
    quarter nvarchar(255),
    town nvarchar(255)
);

create table opinions (
	idOpinion int auto_increment primary key,
    idCitizen bigint,
    content nvarchar(255),
    createAt date,
    foreign key (idCitizen) references citizens(idCitizen)
);

create table notifications (
	idNotification int auto_increment primary key,
    content nvarchar(255),
    idPolitician int
);

create table notification_citizen (
	idNotification int,
    idCitizen bigint,
    foreign key (idNotification) references notifications(idNotification),
    foreign key (idCitizen) references citizens(idCitizen)
);

create table requirements (
	idRequirement int auto_increment primary key,
    createAt date,
    requirementDate date,
    status int default 1,
    content nvarchar(255),
    idCitizen bigint,
    idPolitician int,
    foreign key (idCitizen) references citizens(idCitizen),
    foreign key (idPolitician) references politicians(idPolitician)
);

-- -----------------------
update citizens set status = 1 where idCitizen = 192001823;
