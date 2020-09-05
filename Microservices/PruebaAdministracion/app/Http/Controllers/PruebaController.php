<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Prueba;
use Illuminate\Http\Request;

class PruebaController extends Controller
{
    public function __construct()
    {
        //
    }

    public function addPrueba(Request $request) {
        $idUsuario = $request->get('id');
        $json = $request->getContent();
        DB::select('CALL add_prueba(?,?)', [$idUsuario, $json]);
        return response()->json(['status' => 'success'], 200);
    }

    public function getPruebas(Request $request) {
        $idUsuario = $request->get('id');
        return Prueba::where('usuario_id', $idUsuario)
            ->get()->toJson();
    }

    public function getPrueba(Request $request, $id) {
        $idUsuario = $request->get('id');
        $prueba = Prueba::with(['preguntas', 'preguntas.literales'])
            ->where('usuario_id', $idUsuario)->where('id', $id)->first();
        if($prueba) {
            return $prueba->toJson();
        }
        return response()->json(['status' => 'not found'], 404);
    }
}
