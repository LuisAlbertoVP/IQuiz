<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Archivo;
use Illuminate\Http\Request;

class ExplorerController extends Controller
{
    public function __construct()
    {
        //
    }

    public function getFileParents(Request $request, $id) {
        $idUsuario = $request->get('id');
        $result = DB::select("CALL parents_archivo(?,?)", [$idUsuario, $id == 'home' ? $idUsuario : $id]);
        $result = array_map(function($value){
            return (array)$value;
        }, $result);
        if(sizeof($result) == 0) {
            return $result;
        }
        $result = preg_split('/,/', $result[0]["path"]);
        for($i = 0; $i < sizeof($result); $i++){
            if($i == 0) {
                $result[$i] = array('id' => $result[$i], 'nombre' => 'Home');
            } else {
                $node = preg_split('/:/', $result[$i]);
                $result[$i] = array('id' => $node[0], 'nombre' => $node[1]);
            }
        }
        return $result;
    }

    public function getFileChildren(Request $request, $id) {
        $idUsuario = $request->get('id');
        return Archivo::where('usuario_id', $idUsuario)->where('parent_id', $id == 'home' ? $idUsuario : $id)
            ->selectRaw('id,nombre,es_carpeta as esCarpeta,fecha_creacion as fechaCreacion,fecha_modificacion as fechaModificacion,parent_id,curso_id')
            ->orderBy('nombre', 'asc')->get()->toJson();
    }

    public function addRoot($id) {
        DB::select('CALL add_root(?)', [$id]);
        return response()->json(['status' => 'success'], 200);
    }

    public function addRootChildren(Request $request, $id) {
        $json = $request->getContent();
        $archivos = json_decode($json, true);
        $curso_ids = array();
        foreach($archivos as $archivo) {
            array_push($curso_ids, $archivo['curso_id']);
        }
        Archivo::where('es_carpeta', '0')->where('usuario_id', $id)->whereNotIn('curso_id', $curso_ids)->delete();
        DB::select('CALL add_root_children(?,?)', [$id, $json]);
        return response()->json(['status' => 'success'], 200);
    }
    
    public function addFolder(Request $request) {
        $idUsuario = $request->get('id');
        $json = $request->getContent();
        DB::select('CALL add_archivo(?,?)', [$idUsuario, $json]);
        return response()->json(['status' => 'success'], 200);
    }

    public function deleteFile(Request $request) {
        $idUsuario = $request->get('id');
        $ids = json_decode($request->getContent(), true);
        $children = Archivo::where('usuario_id', $idUsuario)->whereIn('parent_id', $ids)->get();
        if(sizeof($children) == 0) {
            Archivo::where('usuario_id', $idUsuario)->whereIn('id', $ids)->delete();
            return response()->json(['status' => 'success'], 200);
        }
        return response()->json(['status' => 'bad request'], 400);
    }

    public function moveFiles(Request $request, $id) {
        $idUsuario = $request->get('id');
        $json = $request->getContent();
        $json = DB::select('CALL move_archivo(?,?,?)', [$idUsuario, $json, $id == 'home' ? $idUsuario : $id]);
        return $json;
    }
}
