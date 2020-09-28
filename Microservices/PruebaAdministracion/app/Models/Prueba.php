<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prueba extends Model
{
    protected $table = "prueba";

    protected $casts = [ 'id' => 'string' ];

    public function getTiempoAttribute($value) {
        return json_decode($value);
    }

    public function preguntas() {
        return $this->hasMany(Pregunta::class)
            ->orderBy('orden', 'asc');
    }
}
