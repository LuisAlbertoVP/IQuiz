<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $table = "curso";

    protected $casts = [ 'id' => 'string' ];

    public $timestamps = false;

    public function usuarios() {
        return $this->belongsToMany(Usuario::class)
            ->selectRaw('nombres, correo_institucional as correoInstitucional, rol_id');
    }
}
