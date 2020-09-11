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

$router->get('explorer-cuestionario/cuestionarios', 'ExplorerController@getFiles');

$router->get('explorer-cuestionario/cuestionarios/{id}/parents', 'ExplorerController@getFileParents');

$router->get('explorer-cuestionario/cuestionarios/{id}/children', 'ExplorerController@getFileChildren');

$router->post('explorer-cuestionario/cuestionarios/{id}/root', 'ExplorerController@addRoot');

$router->post('explorer-cuestionario/cuestionarios', 'ExplorerController@addFile');

$router->post('explorer-cuestionario/cuestionarios/delete', 'ExplorerController@deleteFile');

$router->post('explorer-cuestionario/cuestionarios/{id}/move', 'ExplorerController@moveFiles');
