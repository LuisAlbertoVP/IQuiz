<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asignacion extends Model
{
    protected $table = "asignacion";

    protected $casts = [ 'id' => 'string' ];

    public $timestamps = false;

    public function getTiempoAttribute($value) {
        return json_decode($value);
    }
    
    public function cuestionarios() {
        return $this->hasMany(Cuestionario::class)
            ->selectRaw('id,cuestionario_id,nombre,asignacion_id');
    }
}
