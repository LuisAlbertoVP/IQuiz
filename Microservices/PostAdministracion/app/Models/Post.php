<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = "post";

    protected $casts = [ 'id' => 'string' ];

    public function comentarios() {
        return $this->hasMany(Comentario::class);
    }
}