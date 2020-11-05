# USER LAVP


drop user if exists 'lavp';
create user 'lavp' identified by 'tesis2020';
grant all privileges on *.* to 'lavp';
flush privileges;


# DATABASE IDENTITY

drop database if exists dbIdentity; 
create database dbIdentity;
use dbIdentity;

create table usuario(
    id varchar(100) primary key not null,
    cedula varchar(10) not null,
    nombres varchar(50) not null,
    correo_institucional varchar(320) not null,
    correo_personal varchar(320) null,
    clave varchar(200) not null,
    estado int not null,
    usuario_ingreso varchar(50) not null,
    fecha_ingreso datetime not null,
    usuario_modificacion varchar(50) null,
    fecha_modificacion datetime null,
    unique(cedula),
    unique(correo_institucional)
);

create table rol(
    id int primary key not null,
    descripcion varchar(20) not null
);

create table rol_usuario(
    usuario_id varchar(100) primary key not null,
    rol_id int not null,
    foreign key(usuario_id) references usuario(id),
    foreign key(rol_id) references rol(id)
);

create table curso_usuario(
    id int primary key not null auto_increment,
    usuario_id varchar(100) not null,
    curso_id varchar(100) not null,
    foreign key(usuario_id) references usuario(id)
);

/* Inserts */
insert into rol values(1, 'Administrador');
insert into rol values(2, 'Profesor');
insert into rol values(3, 'Estudiante');
#clave 123
insert into usuario values('e2ec4818-4af1-4f4e-b2bc-7d1adb2ec341', '0941500720', 'Luis Alberto Velastegui Pino', 'luis.velasteguipi@ug.edu.ec', 'luisv-1@hotmail.com', 
    'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 1, 'Luis Alberto Velastegui Pino', now(), 'Luis Alberto Velastegui Pino', now());
insert into rol_usuario(usuario_id, rol_id) values('e2ec4818-4af1-4f4e-b2bc-7d1adb2ec341', 1);
/* End Inserts*/

delimiter //
create procedure login(in_cedula varchar(10), in_clave varchar(200))
begin
    select u.id, u.nombres, u.estado, r.descripcion 
    from rol_usuario ur
    join usuario u on u.id = ur.usuario_id
    join rol r on r.id = ur.rol_id
    where u.cedula = in_cedula and u.clave = in_clave;
end //
delimiter ;

delimiter //
create procedure usuario_cursos(in_usuario_id varchar(100))
begin
    select curso_id from curso_usuario where usuario_id = in_usuario_id;
end //
delimiter ;

delimiter //
create procedure usuario_por_id(in_id varchar(100))
begin
    select u.id as usuario_id, u.cedula, u.nombres, u.correo_institucional, u.correo_personal, ur.rol_id
    from rol_usuario ur 
    join usuario u on u.id = ur.usuario_id
    where u.id = in_id;
end //
delimiter ;

delimiter //
create procedure usuarios()
begin
    select u.id, u.cedula, u.nombres, u.correo_institucional, u.correo_personal, u.estado, r.descripcion, 
    u.usuario_ingreso, u.fecha_ingreso, u.usuario_modificacion, u.fecha_modificacion
    from rol_usuario ur 
    join usuario u on u.id = ur.usuario_id
    join rol r on r.id = ur.rol_id;
end //
delimiter ;

delimiter //
create procedure activar_usuario(in_id varchar(100))
begin
    update usuario set estado = 1 where id = in_id;
end //
delimiter ;

delimiter //
create procedure desactivar_usuario(in_id varchar(100))
begin
    update usuario set estado = 0 where id = in_id;
end //
delimiter ;

delimiter //
create procedure add_cuenta(json JSON)
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _cedula varchar(10) default json_unquote(json_extract(json, '$.cedula'));
    declare _nombres varchar(50) default json_unquote(json_extract(json, '$.nombres'));
    declare _correo_personal varchar(320) default json_unquote(json_extract(json, '$.correoPersonal'));
    declare _clave varchar(200) default json_unquote(json_extract(json, '$.clave'));
    insert into usuario values(_id, _cedula, _nombres, _correo_personal, _correo_personal, _clave, 0, _nombres, now(), _nombres, now());
    insert into rol_usuario values(_id, 3);
end //
delimiter ;

delimiter //
create procedure update_password(json JSON)
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _clave varchar(200) default json_unquote(json_extract(json, '$.clave'));
    declare _nueva_clave varchar(200) default json_unquote(json_extract(json, '$.nuevaClave'));
    update usuario set clave = _nueva_clave where id = _id and clave = _clave;
end //
delimiter ;

delimiter //
create procedure add_usuario(json JSON)
begin
    declare _countcurso int default 0;
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _cedula varchar(10) default json_unquote(json_extract(json, '$.cedula'));
    declare _nombres varchar(50) default json_unquote(json_extract(json, '$.nombres'));
    declare _correo_institucional varchar(320) default json_unquote(json_extract(json, '$.correoInstitucional'));
    declare _correo_personal varchar(320) default json_unquote(json_extract(json, '$.correoPersonal'));
    declare _clave varchar(200) default json_unquote(json_extract(json, '$.clave'));
    declare _usr_ingreso varchar(50) default json_unquote(json_extract(json, '$.usuarioIngreso'));
    declare _usr_mod varchar(50) default json_unquote(json_extract(json, '$.usuarioModificacion'));
    declare _rol_id varchar(100) default json_unquote(json_extract(json, '$.rol.id'));
    declare _cursos json default json_extract(json, '$.cursos');
    declare _length_curso int default json_length(_cursos);
    declare _curso_id varchar(100);
    set _clave = case when _clave = "null" then (select clave from usuario where id = _id) else _clave end;
    insert into usuario values(_id, _cedula, _nombres, _correo_institucional, _correo_personal, _clave, 1, _usr_ingreso, now(), _usr_mod, now()) on duplicate key 
        update cedula = _cedula, nombres = _nombres, correo_institucional = _correo_institucional, correo_personal = _correo_personal, clave = _clave, 
        usuario_modificacion = _usr_mod, fecha_modificacion = now();
    delete from rol_usuario where usuario_id = _id;
    insert into rol_usuario values(_id, _rol_id);
    delete from curso_usuario where usuario_id = _id;
    while _countcurso != _length_curso do
        set _curso_id = json_unquote(json_extract(_cursos, concat('$[', _countcurso, ']')));
        insert into curso_usuario(usuario_id, curso_id) values(_id, _curso_id);
        set _countcurso = _countcurso + 1;
    end while;
end //
delimiter ;


# DATABASE CUESTIONARIO EXPLORER


drop database if exists dbCuestionarioExplorer; 
create database dbCuestionarioExplorer;
use dbCuestionarioExplorer;

create table archivo(
    id varchar(100) primary key not null,
    nombre varchar(50) not null,
    es_carpeta boolean not null,
    fecha_creacion datetime not null,
    fecha_modificacion datetime not null,
    parent_id varchar(100) null,
    usuario_id varchar(100) not null,
    index(parent_id),
    foreign key(parent_id) references archivo(id)
        on delete cascade
);

/* Inserts */
insert into archivo values('e2ec4818-4af1-4f4e-b2bc-7d1adb2ec341',"root", true, now(), now(), NULL, 'e2ec4818-4af1-4f4e-b2bc-7d1adb2ec341');
/* End Inserts*/

delimiter //
create procedure add_root(in_id varchar(100))
begin
    insert into archivo values(in_id, "root", true, now(), now(), NULL, in_id) on duplicate key update fecha_modificacion = now();
end //
delimiter ;

delimiter //
create procedure parents_archivo(in_usuario_id varchar(100), in_search varchar(100))
begin
    with recursive file_parents (id, nombre, path) as
    (
    select id, nombre, cast(id as char(400)) from archivo where parent_id is null and usuario_id = in_usuario_id
    union all
    select f.id, f.nombre, concat(fp.path, ',', f.id, ':', f.nombre) from file_parents as fp join archivo as f on fp.id = f.parent_id
    )
    select path from file_parents where id = in_search;
end //
delimiter ;

delimiter //
create procedure add_archivo(in_usuario_id varchar(100), json JSON)
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _nombre varchar(50) default json_unquote(json_extract(json, '$.nombre'));
    declare _es_carpeta boolean default json_extract(json, '$.esCarpeta') = true;
    declare _fecha_creacion datetime default json_unquote(json_extract(json, '$.fechaCreacion'));
    declare _fecha_modificacion datetime default json_unquote(json_extract(json, '$.fechaModificacion'));
    declare _parent_id varchar(100) default json_unquote(json_extract(json, '$.parent_id'));
    set _parent_id = case when _parent_id = "home" then in_usuario_id else _parent_id end;
    insert into archivo values(_id, _nombre, _es_carpeta, _fecha_creacion, _fecha_modificacion, _parent_id, in_usuario_id) on duplicate key
        update nombre = _nombre, es_carpeta = _es_carpeta, fecha_modificacion = _fecha_modificacion;
end //
delimiter ;

delimiter //
create procedure move_archivo(in_usuario_id varchar(100), json JSON, in_parent_id varchar(100))
begin
    declare _countid int default 0;
    declare _length_id int default json_length(json);
    declare _id varchar(100);
    while _countid != _length_id do
        set _id = json_unquote(json_extract(json, concat('$[', _countid, ']')));
        select count(*) into @cont from archivo where usuario_id = in_usuario_id and id = _id;
        if @cont = 1 then
            update archivo set parent_id = in_parent_id where id = _id;
        end if;
        set _countid = _countid + 1;
    end while;
    select id, nombre, es_carpeta as esCarpeta, fecha_creacion as fechaCreacion, fecha_modificacion as fechaModificacion, parent_id 
        from archivo where parent_id = in_parent_id;
end //
delimiter ;


# DATABASE CUESTIONARIO ADMINISTRACION


drop database if exists dbCuestionarioAdministracion; 
create database dbCuestionarioAdministracion;
use dbCuestionarioAdministracion;

create table clipboard(
    id varchar(100) primary key not null,
    cuerpo json null
);

create table cuestionario(
    id varchar(100) primary key not null,
    puntaje double not null,
    nombre varchar(50) not null,
    descripcion varchar(200) null,
    tiempo json not null,
    usuario_id varchar(100) not null
);

create table pregunta(
    id varchar(100) primary key not null,
    puntaje double not null,
    orden int not null,
    tipo int not null,
    descripcion varchar(200) null,
    tabla json null,
    retroalimentacion varchar(300) null,
    cuestionario_id varchar(100) not null,
    foreign key(cuestionario_id) references cuestionario(id)
        on delete cascade
);

create table literal(
    id varchar(100) primary key not null,
    orden int not null,
    abreviatura varchar(10) not null,
    descripcion varchar(200) null,
    respuesta varchar(50) null,
    entradas json null,
    pregunta_id varchar(100) not null,
    foreign key(pregunta_id) references pregunta(id)
        on delete cascade
);

create table cuestionario_compartido(
    id int primary key not null auto_increment,
    asignacion_id varchar(100) not null,
    cuestionario_id varchar(100) not null,
    clave varchar(100) not null,
    foreign key(cuestionario_id) references cuestionario(id)
        on delete cascade
);

create table acceso_usuario(
    id int primary key not null auto_increment,
    usuario_id varchar(100) not null,
    cuestionario_compartido_id int not null,
    foreign key(cuestionario_compartido_id) references cuestionario_compartido(id)
        on delete cascade
);

delimiter //
create procedure get_clipboard(in_usuario_id varchar(100))
begin
    select cuerpo from clipboard where id = in_usuario_id;
end //
delimiter ;

delimiter //
create procedure add_clipboard(in_usuario_id varchar(100), json JSON)
begin
    insert into clipboard values(in_usuario_id, json) on duplicate key update cuerpo = json;
end //
delimiter ;

delimiter //
create procedure add_cuestionarios_compartidos(json JSON)
begin
    declare _countCuestionario int default 0;
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _cuestionarios json default json_extract(json, '$.cuestionarios');
    declare _length_cuestionario int default json_length(_cuestionarios);
    declare _cuestionario json;
    declare _cuestionario_id varchar(100);
    declare _clave varchar(100);
    while _countCuestionario != _length_cuestionario do
        set _cuestionario = json_extract(_cuestionarios, concat('$[', _countCuestionario, ']'));
        set _cuestionario_id = json_unquote(json_extract(_cuestionario, '$.cuestionario_id'));
        select count(*) into @cont from cuestionario_compartido where asignacion_id = _id and cuestionario_id = _cuestionario_id;
        if @cont != 1 then
            set _clave = json_unquote(json_extract(_cuestionario, '$.clave'));
            insert into cuestionario_compartido(asignacion_id, cuestionario_id, clave) values(_id, _cuestionario_id, _clave);
        end if;
        set _countCuestionario = _countCuestionario + 1;
    end while;
end //
delimiter ;

delimiter //
create function verificar_credenciales(in_usuario_id varchar(100), in_asignacion_id varchar(100), json JSON)
returns int
begin
    declare band boolean default false;
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _clave varchar(100) default json_unquote(json_extract(json, '$.clave'));
    set _id = (select id from cuestionario_compartido where asignacion_id = in_asignacion_id and cuestionario_id = _id and clave = _clave);
    if (select count(*) from acceso_usuario where usuario_id = in_usuario_id and cuestionario_compartido_id = _id) = 0 then
        insert into acceso_usuario(usuario_id, cuestionario_compartido_id) values(in_usuario_id, _id);
        set band = true;
    end if;
    return band;
end //
delimiter ;

delimiter //
create procedure add_literal(in_pregunta_id varchar(100), json JSON)
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _orden int default json_extract(json, '$.orden');
    declare _abreviatura varchar(10) default json_unquote(json_extract(json, '$.abreviatura'));
    declare _descripcion varchar(200) default json_unquote(json_extract(json, '$.descripcion'));
    declare _respuesta varchar(50) default json_unquote(json_extract(json, '$.respuesta'));
    declare _entradas json default json_extract(json, '$.entradas');
    insert into literal values(_id, _orden, _abreviatura, _descripcion, _respuesta, _entradas, in_pregunta_id) on duplicate key 
        update orden = _orden, abreviatura = _abreviatura, descripcion = _descripcion, respuesta = _respuesta, entradas = _entradas;
end //
delimiter ;

delimiter //
create procedure add_pregunta(in_cuestionario_id varchar(100), json JSON)
begin
    declare _countliteral int default 0;
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _puntaje double default json_extract(json, '$.puntaje');
    declare _orden int default json_extract(json, '$.orden');
    declare _tipo int default json_extract(json, '$.tipo');
    declare _descripcion varchar(200) default json_unquote(json_extract(json, '$.descripcion'));
    declare _tabla json default json_extract(json, '$.tabla');
    declare _retroalimentacion varchar(300) default json_unquote(json_extract(json, '$.retroalimentacion'));
    declare _literal json default json_extract(json, '$.literales');
    declare _length_literal int default json_length(_literal);
    insert into pregunta values(_id, _puntaje, _orden, _tipo, _descripcion, _tabla, _retroalimentacion, in_cuestionario_id) on duplicate key 
        update puntaje = _puntaje, orden = _orden, tipo = _tipo, descripcion = _descripcion, tabla = _tabla, retroalimentacion = _retroalimentacion;
    while _countliteral != _length_literal do
        call add_literal(_id, json_extract(_literal, concat('$[', _countliteral, ']')));
        set _countliteral = _countliteral + 1;
    end while;
end //
delimiter ;

delimiter //
create procedure add_cuestionario(in_usuario_id varchar(100), json JSON)
begin
    declare _countpregunta int default 0;
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _puntaje double default json_extract(json, '$.puntaje');
    declare _nombre varchar(50) default json_unquote(json_extract(json, '$.nombre'));
    declare _descripcion varchar(200) default json_unquote(json_extract(json, '$.descripcion'));
    declare _tiempo json default json_extract(json, '$.tiempo');
    declare _pregunta json default json_extract(json, '$.preguntas');
    declare _length_pregunta int default json_length(_pregunta);
    insert into cuestionario values(_id, _puntaje, _nombre, _descripcion, _tiempo, in_usuario_id) on duplicate key 
        update puntaje = _puntaje, nombre = _nombre, descripcion = _descripcion, tiempo = _tiempo;
    while _countpregunta != _length_pregunta do
        call add_pregunta(_id, json_extract(_pregunta, concat('$[', _countpregunta, ']')));
        set _countpregunta = _countpregunta + 1;
    end while;
end //
delimiter ;


# DATABASE PRUEBA ADMINISTRACION


drop database if exists dbPruebaAdministracion; 
create database dbPruebaAdministracion;
use dbPruebaAdministracion;

create table prueba(
    id varchar(100) primary key not null,
    puntaje double not null,
    nota double not null,
    nombre varchar(50) not null,
    descripcion varchar(200) null,
    tiempo json not null,
    fecha datetime not null,
    materia varchar(50) not null,
    usuario_id varchar(100) not null
);

create table pregunta(
    id varchar(100) primary key not null,
    puntaje double not null,
    nota double not null,
    orden int not null,
    tipo int not null,
    descripcion varchar(200) null,
    tabla json null,
    retroalimentacion varchar(300) null,
    prueba_id varchar(100) not null,
    foreign key(prueba_id) references prueba(id)
);

create table literal(
    id varchar(100) primary key not null,
    puntaje double null,
    nota double null,
    orden int not null,
    abreviatura varchar(10) not null,
    descripcion varchar(200) null,
    respuesta varchar(50) null,
    respuesta2 varchar(50) null,
    entradas json null,
    pregunta_id varchar(100) not null,
    foreign key(pregunta_id) references pregunta(id)
);

delimiter //
create procedure add_literal(in_pregunta_id varchar(100), json JSON)
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _puntaje double default json_extract(json, '$.puntaje');
    declare _nota double default json_extract(json, '$.nota');
    declare _orden int default json_extract(json, '$.orden');
    declare _abreviatura varchar(10) default json_unquote(json_extract(json, '$.abreviatura'));
    declare _descripcion varchar(200) default json_unquote(json_extract(json, '$.descripcion'));
    declare _respuesta varchar(50) default json_unquote(json_extract(json, '$.respuesta'));
    declare _respuesta2 varchar(500) default json_unquote(json_extract(json, '$.respuesta2'));
    declare _entradas json default json_extract(json, '$.entradas');
    insert into literal values(_id, _puntaje, _nota, _orden, _abreviatura, _descripcion, _respuesta, _respuesta2, _entradas, in_pregunta_id);
end //
delimiter ;

delimiter //
create procedure add_pregunta(in_prueba_id varchar(100), json JSON)
begin
    declare _countliteral int default 0;
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _puntaje double default json_extract(json, '$.puntaje');
    declare _nota double default json_extract(json, '$.nota');
    declare _orden int default json_extract(json, '$.orden');
    declare _tipo int default json_extract(json, '$.tipo');
    declare _descripcion varchar(200) default json_unquote(json_extract(json, '$.descripcion'));
    declare _tabla json default json_extract(json, '$.tabla');
    declare _retroalimentacion varchar(300) default json_unquote(json_extract(json, '$.retroalimentacion'));
    declare _literal json default json_extract(json, '$.literales');
    declare _length_literal int default json_length(_literal);
    insert into pregunta values(_id, _puntaje, _nota, _orden, _tipo, _descripcion, _tabla, _retroalimentacion, in_prueba_id);
    while _countliteral != _length_literal do
        call add_literal(_id, json_extract(_literal, concat('$[', _countliteral, ']')));
        set _countliteral = _countliteral + 1;
    end while;
end //
delimiter ;

delimiter //
create procedure add_prueba(in_usuario_id varchar(100), json JSON)
begin
    declare _countpregunta int default 0;
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _puntaje double default json_extract(json, '$.puntaje');
    declare _nota double default json_extract(json, '$.nota');
    declare _nombre varchar(50) default json_unquote(json_extract(json, '$.nombre'));
    declare _descripcion varchar(200) default json_unquote(json_extract(json, '$.descripcion'));
    declare _tiempo json default json_extract(json, '$.tiempo');
    declare _materia varchar(50) default json_unquote(json_extract(json, '$.materia'));
    declare _pregunta json default json_extract(json, '$.preguntas');
    declare _length_pregunta int default json_length(_pregunta);
    insert into prueba values(_id, _puntaje, _nota, _nombre, _descripcion, _tiempo, now(), _materia, in_usuario_id);
    while _countpregunta != _length_pregunta do
        call add_pregunta(_id, json_extract(_pregunta, concat('$[', _countpregunta, ']')));
        set _countpregunta = _countpregunta + 1;
    end while;
end //
delimiter ;


# DATABASE AULA EXPLORER


drop database if exists dbAulaExplorer; 
create database dbAulaExplorer;
use dbAulaExplorer;

create table archivo(
    id varchar(100) primary key not null,
    nombre varchar(50) not null,
    es_carpeta boolean not null,
    fecha_creacion datetime not null,
    fecha_modificacion datetime not null,
    parent_id varchar(100) null,
    usuario_id varchar(100) not null,
    curso_id varchar(100) null,
    index(parent_id),
    foreign key(parent_id) references archivo(id)
        on delete cascade
);

/* Inserts */
insert into archivo values('e2ec4818-4af1-4f4e-b2bc-7d1adb2ec341',"root", true, now(), now(), NULL, 'e2ec4818-4af1-4f4e-b2bc-7d1adb2ec341', NULL);
/* End Inserts*/

delimiter //
create procedure add_root(in_id varchar(100))
begin
    insert into archivo values(in_id, "root", true, now(), now(), NULL, in_id, NULL) on duplicate key update fecha_modificacion = now();
end //
delimiter ;

delimiter //
create procedure add_root_children(in_id varchar(100), json JSON)
begin
    declare _countarchivo int default 0;
    declare _length_archivo int default json_length(json);
    declare _archivo json;
    while _countarchivo != _length_archivo do
        set _archivo = json_extract(json, concat('$[', _countarchivo, ']'));
        select count(*) into @cont from archivo where usuario_id = in_id and curso_id = json_unquote(json_extract(_archivo, '$.curso_id'));
        if @cont != 1 then
            call add_archivo(in_id, _archivo);
        end if;
        set _countarchivo = _countarchivo + 1;
    end while;
end //
delimiter ;

delimiter //
create procedure parents_archivo(in_usuario_id varchar(100), in_search varchar(100))
begin
    with recursive file_parents (id, nombre, path) as
    (
    select id, nombre, cast(id as char(200)) from archivo where parent_id is null and usuario_id = in_usuario_id
    union all
    select f.id, f.nombre, concat(fp.path, ',', f.id, ':', f.nombre) from file_parents as fp join archivo as f on fp.id = f.parent_id
    )
    select path from file_parents where id = in_search;
end //
delimiter ;

delimiter //
create procedure add_archivo(in_usuario_id varchar(100), json JSON)
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _nombre varchar(50) default json_unquote(json_extract(json, '$.nombre'));
    declare _es_carpeta boolean default json_extract(json, '$.esCarpeta') = true;
    declare _fecha_creacion datetime default json_unquote(json_extract(json, '$.fechaCreacion'));
    declare _fecha_modificacion datetime default json_unquote(json_extract(json, '$.fechaModificacion'));
    declare _parent_id varchar(100) default json_unquote(json_extract(json, '$.parent_id'));
    declare _curso_id varchar(100) default json_unquote(json_extract(json, '$.curso_id'));
    set _parent_id = case when _parent_id = "home" then in_usuario_id else _parent_id end;
    insert into archivo values(_id, _nombre, _es_carpeta, _fecha_creacion, _fecha_modificacion, _parent_id, in_usuario_id, _curso_id) on duplicate key
        update nombre = _nombre, es_carpeta = _es_carpeta, fecha_modificacion = _fecha_modificacion;
end //
delimiter ; 

delimiter //
create procedure move_archivo(in_usuario_id varchar(100), json JSON, in_parent_id varchar(100))
begin
    declare _countid int default 0;
    declare _length_id int default json_length(json);
    declare _id json;
    while _countid != _length_id do
        set _id = json_unquote(json_extract(json, concat('$[', _countid, ']')));
        select count(*) into @cont from archivo where usuario_id = in_usuario_id and id = _id;
        if @cont = 1 then
            update archivo set parent_id = in_parent_id where id = _id;
        end if;
        set _countid = _countid + 1;
    end while;
    select id, nombre, es_carpeta as esCarpeta, fecha_creacion as fechaCreacion, fecha_modificacion as fechaModificacion, parent_id, curso_id 
        from archivo where parent_id = in_parent_id;
end //
delimiter ;


# DATABASE ASIGNACION ADMINISTRACION


drop database if exists dbAsignacionAdministracion; 
create database dbAsignacionAdministracion;
use dbAsignacionAdministracion;

create table curso(
    id varchar(100) primary key not null,
    nombre varchar(50) not null,
    materia varchar(50) not null,
    estado int not null
);

create table usuario(
    id varchar(100) primary key not null,
    nombres varchar(50) not null,
    correo_institucional varchar(320) not null,
    rol_id varchar(10) not null
);

create table curso_usuario(
    id int primary key not null auto_increment,
    usuario_id varchar(100) not null,
    curso_id varchar(100) not null,
    foreign key(usuario_id) references usuario(id),
    foreign key(curso_id) references curso(id)
);

create table asignacion(
    id varchar(100) primary key not null,
    tema varchar(50) not null,
    instrucciones varchar(200) null,
    fecha date not null,
    tiempo json not null,
    curso_id varchar(100) not null,
    estado int not null,
    foreign key(curso_id) references curso(id)
);

create table cuestionario(
    id varchar(100) primary key not null,
    cuestionario_id varchar(100) not null,
    nombre varchar(50) not null,
    clave varchar(100) not null,
    asignacion_id varchar(100) not null,
    foreign key (asignacion_id) references asignacion(id)
);

create table prueba(
    id int primary key not null auto_increment,
    usuario_id varchar(100) not null,
    cuestionario_id varchar(100) not null,
    nota double not null,
    fecha datetime not null,
    foreign key(usuario_id) references usuario(id),
    foreign key(cuestionario_id) references cuestionario(id)
);

delimiter //
create procedure add_curso(json JSON)
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _nombre varchar(50) default json_unquote(json_extract(json, '$.nombre'));
    declare _materia varchar(50) default json_unquote(json_extract(json, '$.materia'));
    insert into curso values(_id, _nombre, _materia, 1) on duplicate key 
        update nombre = _nombre, materia = _materia;
end //
delimiter ;

delimiter //
create procedure add_usuario_cursos(json JSON)
begin
    declare _countcurso int default 0;
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _nombres varchar(50) default json_unquote(json_extract(json, '$.nombres'));
    declare _correo_institucional varchar(320) default json_unquote(json_extract(json, '$.correoInstitucional'));
    declare _rol_id varchar(10) default json_unquote(json_extract(json, '$.rol.id'));
    declare _cursos json default json_extract(json, '$.cursos');
    declare _length_curso int default json_length(_cursos);
    declare _curso_id varchar(100);
    insert into usuario values(_id, _nombres, _correo_institucional, _rol_id) on duplicate key 
        update nombres = _nombres, correo_institucional = _correo_institucional, rol_id = _rol_id;
    delete from curso_usuario where usuario_id = _id;
    while _countcurso != _length_curso do
        set _curso_id = json_unquote(json_extract(_cursos, concat('$[', _countcurso, ']')));
        insert into curso_usuario(usuario_id, curso_id) values(_id, _curso_id);
        set _countcurso = _countcurso + 1;
    end while;
end //
delimiter ;

delimiter //
create procedure add_asignacion_cuestionario(in_asignacion_id varchar(100), json JSON)
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _cuestionario_id varchar(50) default json_unquote(json_extract(json, '$.cuestionario_id'));
    declare _nombre varchar(200) default json_unquote(json_extract(json, '$.nombre'));
    declare _clave json default json_unquote(json_extract(json, '$.clave'));
    insert into cuestionario values(_id, _cuestionario_id, _nombre, _clave, in_asignacion_id) on duplicate key
        update nombre = _nombre;
end //
delimiter ; 

delimiter //
create procedure add_asignacion(in_curso_id varchar(100), json JSON)
begin
    declare _countcuestionario int default 0;
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _tema varchar(50) default json_unquote(json_extract(json, '$.tema'));
    declare _instrucciones varchar(200) default json_unquote(json_extract(json, '$.instrucciones'));
    declare _fecha json default json_unquote(json_extract(json, '$.fecha'));
    declare _tiempo json default json_extract(json, '$.tiempo');
    declare _cuestionarios json default json_extract(json, '$.cuestionarios');
    declare _length_cuestionario int default json_length(_cuestionarios);
    insert into asignacion values(_id, _tema, _instrucciones, _fecha, _tiempo, in_curso_id, 1) on duplicate key
        update tema = _tema, instrucciones = _instrucciones, fecha = _fecha, tiempo = _tiempo;
    while _countcuestionario != _length_cuestionario do
        call add_asignacion_cuestionario(_id, json_extract(_cuestionarios, concat('$[', _countcuestionario, ']')));
        set _countcuestionario = _countcuestionario + 1;
    end while;
end //
delimiter ; 

delimiter //
create procedure add_prueba_curso(in_usuario_id varchar(100) , json JSON)
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _nota double default json_extract(json, '$.nota');
    insert into prueba(usuario_id, cuestionario_id, nota, fecha) values(in_usuario_id, _id, _nota, now());
end //
delimiter ;


# DATABASE POST ADMINISTRACION


drop database if exists dbPostAdministracion; 
create database dbPostAdministracion;
use dbPostAdministracion;

create table post(
    id varchar(100) primary key not null,
    autor varchar(50) not null,
    fecha datetime not null,
    descripcion varchar(300) not null,
    curso_id varchar(100) not null
);

create table comentario(
    id varchar(100) primary key not null,
    autor varchar(50) not null,
    fecha datetime not null,
    descripcion varchar(300) not null,
    post_id varchar(100) not null,
    foreign key(post_id) references post(id)
);

delimiter //
create procedure add_comentario(in_post_id varchar(100), json JSON, in_nombres varchar(50))
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _fecha datetime default json_unquote(json_extract(json, '$.fecha'));
    declare _descripcion varchar(300) default json_unquote(json_extract(json, '$.descripcion'));
    insert into comentario values(_id, in_nombres, _fecha, _descripcion, in_post_id);
end //
delimiter ; 

delimiter //
create procedure add_post(in_curso_id varchar(100), json JSON, in_nombres varchar(50))
begin
    declare _id varchar(100) default json_unquote(json_extract(json, '$.id'));
    declare _fecha datetime default json_unquote(json_extract(json, '$.fecha'));
    declare _descripcion varchar(300) default json_unquote(json_extract(json, '$.descripcion'));
    insert into post values(_id, in_nombres, _fecha, _descripcion, in_curso_id);
end //
delimiter ; 
