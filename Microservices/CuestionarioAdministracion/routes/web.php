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

$router->get('cuestionario-administracion/cuestionarios/{id}', 'CuestionarioController@getCuestionario');

$router->post('cuestionario-administracion/cuestionarios', 'CuestionarioController@addCuestionario');

$router->post('cuestionario-administracion/cuestionarios/compartido', 'CuestionarioController@addCuestionariosCompartidos');

$router->post('cuestionario-administracion/cuestionarios/compartido/{id}', 'CuestionarioController@getCuestionarioCompartido');