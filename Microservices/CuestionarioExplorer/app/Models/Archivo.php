<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archivo extends Model
{
    protected $table = "archivo";

    protected $casts = [ 'id' => 'string' ];
}
