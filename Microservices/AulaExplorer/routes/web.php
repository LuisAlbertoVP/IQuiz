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

$router->get('explorer-aula/aulas/{id}/parents', 'ExplorerController@getFileParents');

$router->get('explorer-aula/aulas/{id}/children', 'ExplorerController@getFileChildren');

$router->post('explorer-aula/aulas/{id}/root', 'ExplorerController@addRoot');

$router->post('explorer-aula/aulas/{id}/root/children', 'ExplorerController@addRootChildren');

$router->post('explorer-aula/aulas', 'ExplorerController@addFolder');

$router->post('explorer-aula/aulas/delete', 'ExplorerController@deleteFile');

$router->post('explorer-aula/aulas/{id}/move', 'ExplorerController@moveFiles');
