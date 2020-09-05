<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = "usuario";

    protected $casts = [ 'id' => 'string' ];

    public function cursos() {
        return $this->belongsToMany(Curso::class);
    }
}