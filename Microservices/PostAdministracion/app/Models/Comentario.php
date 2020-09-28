<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    protected $table = "comentario";

    protected $casts = [ 'id' => 'string' ];
}