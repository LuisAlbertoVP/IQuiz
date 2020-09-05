<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pregunta extends Model
{
    protected $table = "pregunta";

    protected $casts = [ 'id' => 'string' ];
    
    public function getTablaAttribute($value) {
        return json_decode($value);
    }

    public function literales() {
        return $this->hasMany(Literal::class)
            ->orderBy('orden', 'asc');
    }
}
