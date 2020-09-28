<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cuestionario extends Model
{
    protected $table = "cuestionario";

    protected $casts = [ 'id' => 'string' ];

    public $timestamps = false;

    public function getTiempoAttribute($value) {
        return json_decode($value);
    }

    public function preguntas() {
        return $this->hasMany(Pregunta::class)
            ->orderBy('orden', 'asc');
    }
}
