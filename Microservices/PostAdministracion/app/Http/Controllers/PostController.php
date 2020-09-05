<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Post;
use App\Models\Comentario;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct()
    {
        //
    }

    public function getCursoPosts($id) {
        return Post::with(['comentarios'])
            ->where('curso_id', $id)->get();
    }

    public function addCursoPost(Request $request, $id) {
        $nombresUsuario = $request->get('nombres');
        $json = $request->getContent();
        DB::select('CALL add_post(?,?,?)', [$id, $json, $nombresUsuario]);
        return response()->json(['status' => 'success'], 200); 
    }  

    public function addPostComentario(Request $request, $id) {
        $nombresUsuario = $request->get('nombres');
        $json = $request->getContent();
        DB::select('CALL add_comentario(?,?,?)', [$id, $json, $nombresUsuario]);
        return response()->json(['status' => 'success'], 200); 
    }  
}
