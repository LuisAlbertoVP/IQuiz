<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('asignacion-administracion/cursos', 'AsignacionController@getCursos');

$router->get('asignacion-administracion/cursos/{id}', 'AsignacionController@getCurso');

$router->get('asignacion-administracion/cursos/{id}/usuarios', 'AsignacionController@getCursoUsuarios');

$router->get('asignacion-administracion/cursos/{id}/pruebas', 'AsignacionController@getCursoPruebas');

$router->get('asignacion-administracion/cursos/{id}/asignaciones', 'AsignacionController@getCursoAsignaciones');

$router->get('asignacion-administracion/cursos/asignaciones/{id}/cuestionarios/{id2}', 'AsignacionController@getCuestionarioClave');

$router->post('asignacion-administracion/cursos', 'AsignacionController@addCurso');

$router->post('asignacion-administracion/cursos/{id}/disabled', 'AsignacionController@disabledCurso');

$router->post('asignacion-administracion/cursos/{id}/enabled', 'AsignacionController@enabledCurso');

$router->post('asignacion-administracion/cursos/{id}/asignaciones', 'AsignacionController@addCursoAsignacion');

$router->post('asignacion-administracion/cursos/asignaciones/{id}/disabled', 'AsignacionController@disabledAsignacion');

$router->post('asignacion-administracion/cursos/usuarios', 'AsignacionController@addUserCurso');

$router->post('asignacion-administracion/cursos/pruebas', 'AsignacionController@addPruebaCurso');