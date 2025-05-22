<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use SebastianBergmann\CodeCoverage\Report\Xml\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'is_public_account',
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
            'is_public_account' => 'boolean',
        ];
    }

    public function profileable()
    {
        return $this->morphTo(); // opcional si ho tens així, però pots tenir relacions normals
    }

    public function company()
    {
        return $this->hasOne(Company::class, 'user_id', 'id');
    }

    public function institutions()
    {
        return $this->hasOne(Institutions::class, 'user_id', 'id');
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id', 'id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    // Usuario ha sido reportado
    public function reportsReceived()
    {
        return $this->hasMany(Report::class, 'reported_user_id');
    }

    // Usuario ha reportado a otros
    public function reportsMade()
    {
        return $this->hasMany(Report::class, 'reported_by_id');
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

    //follower things
    // Usuarios a los que sigue este usuario (status: approved)
    public function following()
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'following_id')
            ->withPivot('status')
            ->wherePivot('status', 'approved')
            ->withTimestamps()
            ->with(['student', 'company', 'institution']);

    }

    // Comprueba si este usuario sigue al usuario $userId
    public function followCheck(int $userId): bool
    {
        return $this->belongsToMany(
            User::class,
            'followers',
            'follower_id',
            'following_id'
        )
            ->wherePivot('status', 'approved')
            ->where('followers.following_id', $userId)
            ->exists();
    }

    // Usuarios que siguen a este usuario (status: approved)
    public function followers()
    {
        return $this->belongsToMany(User::class, 'followers', 'following_id', 'follower_id')
            ->withPivot('status')
            ->wherePivot('status', 'approved')
            ->withTimestamps()
            ->with(['student', 'company', 'institutions']);
    }

    // Solicitudes pendientes para seguir
    public function pendingFollowRequests()
    {
        return $this->belongsToMany(User::class, 'followers', 'following_id', 'follower_id')
            ->withPivot('status')
            ->wherePivot('status', 'pending')
            ->withTimestamps();
    }

    // Solicitudes pendientes enviadas por el usuario
    public function pendingSentRequests()
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'following_id')
            ->withPivot('status')
            ->wherePivot('status', 'pending')
            ->withTimestamps();
    }

    // Usuarios bloqueados por este usuario
    public function blockedUsers()
    {
        return $this->belongsToMany(User::class, 'blocked_users', 'user_id', 'blocked_user_id')
            ->withTimestamps();
    }

    // Usuarios que han bloqueado a este usuario
    public function blockedBy()
    {
        return $this->belongsToMany(User::class, 'blocked_users', 'blocked_user_id', 'user_id')
            ->withTimestamps();
    }



    // Relacion entre user y publicaciones
    // Relacion con las publicaciones creadas por este usuario
    public function publications()
    {
        return $this->hasMany(Publication::class);
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
        return $this->belongsToMany(Publication::class, 'publication_likes', 'user_id', 'publication_id')
            ->withTimestamps();
    }
}
