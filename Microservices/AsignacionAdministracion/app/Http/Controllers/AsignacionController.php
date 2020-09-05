<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Curso;
use App\Models\Asignacion;
use App\Models\Cuestionario;
use App\Models\Usuario;
use Illuminate\Http\Request;

class AsignacionController extends Controller
{
    public function __construct()
    {
        //
    }

    public function getCursos() {
        return Curso::orderBy('nombre', 'asc')->get()->toJson();
    }

    public function getCurso($id) {
        return Curso::where('id', $id)->first();
    }

    public function getCursoUsuarios($id) {
        return Curso::where('id', $id)->first()->usuarios;
    }

    public function getCursoPruebas($id) {
        return Asignacion::with(['cuestionarios.prueba'])
            ->where('curso_id', $id)->get();
    }

    public function getCursoAsignaciones($id) {
        return Asignacion::with(['cuestionarios'])
            ->where('curso_id', $id)->get();
    }

    public function getCuestionarioClave($id, $id2) {
        $duracion = Asignacion::where('id', $id)->get(['fecha', 'tiempo'])->first();
        $fecha = date_create_from_format('Y-m-d', $duracion->fecha);
        $mes = $fecha->format('m');
        $dia = $fecha->format('d');
        $año = $fecha->format('Y');
        $hora = $duracion->tiempo->hour;
        $minuto = $duracion->tiempo->minute;
        $total = mktime($hora, $minuto, null, $mes, $dia, $año);
        if(time() >= $total) {
            return Cuestionario::where('id', $id2)->get(['clave'])->first();
        }
        return response()->json(['status' => 'not authorized'], 403);
    }

    public function addCurso(Request $request) {
        $json = $request->getContent();
        DB::select('CALL add_curso(?)', [$json]);
        return response()->json(['status' => 'success'], 200); 
    }  
    
    public function disabledCurso($id) {
        Curso::where('id', $id)->update(['estado' => '0']);
        return response()->json(['status' => 'success'], 200);
    }

    public function enabledCurso($id) {
        Curso::where('id', $id)->update(['estado' => '1']);
        return response()->json(['status' => 'success'], 200);
    } 

    public function addCursoAsignacion(Request $request, $id) {
        $json = $request->getContent();
        $asignacion = json_decode($json, true);
        $id_cuestionarios = array();
        foreach($asignacion['cuestionarios'] as $cuestionario) {
            array_push($id_cuestionarios, $cuestionario['cuestionario_id']);
        }
        Cuestionario::where('asignacion_id', $asignacion['id'])
            ->whereNotIn('cuestionario_id', $id_cuestionarios)->delete();
        DB::select('CALL add_asignacion(?,?)', [$id, $json]);
        return response()->json(['status' => 'success'], 200); 
    } 

    public function addUserCurso(Request $request) {
        $json = $request->getContent();
        DB::select('CALL add_usuario_cursos(?)', [$json]);
        return response()->json(['status' => 'success'], 200); 
    } 

    public function addPruebaCurso(Request $request) {
        $idUsuario = $request->get('id');
        $json = $request->getContent();
        DB::select('CALL add_prueba_curso(?,?)', [$idUsuario, $json]);
        return response()->json(['status' => 'success'], 200); 
    } 
}
