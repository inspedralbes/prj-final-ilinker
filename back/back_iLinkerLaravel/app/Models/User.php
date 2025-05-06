<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Couchbase\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use SebastianBergmann\CodeCoverage\Report\Xml\Project;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'surname',
        'birthday',
        'email',
        'password',
        'rol',
        'active',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function company()
    {
        return $this->hasOne(Company::class, 'user_id');
    }

    public function institutions()
    {
        return $this->hasOne(Institutions::class, 'user_id');
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id');
    }

    public function education()
    {
        return $this->HasMany(StudentEducation::class, 'student_id');
    }

    public function experience()
    {
        return $this->HasMany(StudentExperience::class, 'student_id');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'student_skills', 'student_id', 'skill_id');
    }

    public function projects()
    {
        return $this->HasMany(StudentProject::class, 'user_id');
    }

    // Relación con los chat rooms que el usuario ha creado
    public function createdChatRooms()
    {
        return $this->hasMany(ChatRoom::class, 'created_by');
    }

    // Relación con los chat rooms a los que pertenece el usuario
    public function chatRooms()
    {
        return $this->belongsToMany(ChatRoom::class, 'chat_room_user')
            ->withPivot('role', 'last_read_at')
            ->withTimestamps();
    }

    // Relación con los mensajes enviados por el usuario
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    // Relación con los chats directos donde el usuario es el primer participante
    public function directChatsAsUserOne()
    {
        return $this->hasMany(DirectChat::class, 'user_one_id');
    }

    // Relación con los chats directos donde el usuario es el segundo participante
    public function directChatsAsUserTwo()
    {
        return $this->hasMany(DirectChat::class, 'user_two_id');
    }

    // Método para obtener todos los chats directos del usuario
    public function directChats()
    {
        return $this->directChatsAsUserOne->merge($this->directChatsAsUserTwo);
    }

    // Método para obtener un chat directo con otro usuario específico
    public function getDirectChatWith($userId)
    {
        return DirectChat::where(function ($query) use ($userId) {
            $query->where('user_one_id', $this->id)
                ->where('user_two_id', $userId);
        })->orWhere(function ($query) use ($userId) {
            $query->where('user_one_id', $userId)
                ->where('user_two_id', $this->id);
        })->first();
    }


    // Relacion entre user y publicaciones
    // Relacion con las publicaciones creadas por este usuario
    public function publications()
    {
        return $this->hasMany(Publications::class);
    }

    // Relacion con los comentarios realizados por este usuario
    public function publicationComments()
    {
        return $this->hasMany(PublicationComment::class);
    }

    // Relacion con los likes dandos por este usuario
    public function publicationLikes()
    {
        return $this->hasMany(PublicationLike::class);
    }

    // Relación con las publicaciones que le han gustado a este usuario
    public function likedPublications()
    {
        return $this->belongsToMany(Publications::class, 'publication_likes', 'user_id', 'publication_id')
            ->withTimestamps();
    }
}
