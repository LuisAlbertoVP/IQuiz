<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cuestionario extends Model
{
    protected $table = "cuestionario";

    protected $casts = [ 'id' => 'string' ];

    public $timestamps = false;

    public function prueba() {
        return $this->belongsToMany(Usuario::class, 'prueba')
            ->withPivot(['nota', 'fecha']);
    }
}
