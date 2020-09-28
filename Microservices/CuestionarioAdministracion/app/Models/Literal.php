<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Literal extends Model
{
    protected $table = "literal";

    protected $casts = [ 'id' => 'string' ];
    
    public function getEntradasAttribute($value) {
        return json_decode($value);
    }
}
