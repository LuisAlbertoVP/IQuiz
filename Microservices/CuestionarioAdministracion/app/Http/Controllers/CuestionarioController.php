<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Archivo;
use App\Models\CuestionarioCompartido;
use App\Models\Cuestionario;
use App\Models\Pregunta;
use App\Models\Literal;
use Illuminate\Http\Request;

class CuestionarioController extends Controller
{
    public function __construct()
    {
        //
    }


    public function getCuestionario(Request $request, $id) {
        $idUsuario = $request->get('id');
        $cuestionario = Cuestionario::with(['preguntas','preguntas.literales'])
            ->selectRaw('id,puntaje,nombre,descripcion,tiempo')
            ->where('usuario_id', $idUsuario)->where('id', $id)->first();
        if($cuestionario) {
            return $cuestionario;
        }
        return response()->json(['status' => 'not found'], 404);
    }

    public function getCuestionarioCompartido(Request $request, $id) {
        $idUsuario = $request->get('id');
        $json = $request->getContent();
        $query = DB::select('SELECT verificar_credenciales(?,?,?) as veces', [$idUsuario, $id, $json])[0];
        if($query->veces == 1) {
            $cuestionario = Cuestionario::with(['preguntas','preguntas.literales'])
                ->selectRaw('id,puntaje,nombre,descripcion,tiempo')
                ->where('id', (json_decode($json, true))['id'])->first();
            if($cuestionario) {
                return $cuestionario->toJson();
            }
            return response()->json(['status' => 'not found'], 404);
        }
        return response()->json(['status' => 'not authorized'], 403);
    }
    
    public function addCuestionario(Request $request){
        $idUsuario = $request->get('id');
        $json = $request->getContent();
        $cuestionario = json_decode($json, true);
        $id_preguntas = array();
        $id_literales = array();
        foreach($cuestionario['preguntas'] as $pregunta) {
            array_push($id_preguntas, $pregunta['id']);
            foreach($pregunta['literales'] as $literal) {
                array_push($id_literales, $literal['id']);
            }
        }
        Pregunta::where('cuestionario_id', $cuestionario['id'])->whereNotIn('id', $id_preguntas)->delete();
        Literal::whereIn('pregunta_id', $id_preguntas)->whereNotIn('id', $id_literales)->delete();
        DB::select('CALL add_cuestionario(?,?)', [$idUsuario, $json]);
        return response()->json(['status' => 'success'], 200);
    }

    public function addCuestionariosCompartidos(Request $request){
        $json = $request->getContent();
        $asignacion = json_decode($json, true);
        $id_cuestionarios = array();
        foreach($asignacion['cuestionarios'] as $cuestionario) {
            array_push($id_cuestionarios, $cuestionario['cuestionario_id']);
        }
        CuestionarioCompartido::where('asignacion_id', $asignacion['id'])
            ->whereNotIn('cuestionario_id', $id_cuestionarios)->delete();
        DB::select('CALL add_cuestionarios_compartidos(?)', [$json]);
        return response()->json(['status' => 'success'], 200);
    }
}
