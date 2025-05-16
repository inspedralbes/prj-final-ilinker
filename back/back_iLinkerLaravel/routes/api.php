<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\CoursesController;
use App\Http\Controllers\FollowerController;
use App\Http\Controllers\HelpUserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserSettingsController;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\AuthController;
use \App\Http\Controllers\UserController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\PagesController;
use \App\Http\Controllers\SkillController;
use App\Http\Controllers\SkillsController;
use App\Http\Controllers\CompanyController;
use \App\Http\Controllers\ExperienceController;
use App\Http\Controllers\Auth\GoogleController;
use \App\Http\Controllers\InstitutionController;
use \App\Http\Controllers\StudentEducationController;
use \App\Http\Controllers\CambiarContraseñaController;
use App\Http\Controllers\PublicationsController;
use \App\Http\Controllers\PublicationsCommentController;
use App\Http\Controllers\SharedPublicationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    // ruta para enviar el código de recuperación de contraseña
    Route::post('/sendRecoveryCode', [CambiarContraseñaController::class, 'sendCode']);
    Route::post('/verifyCode', [CambiarContraseñaController::class, 'verifyCode']);
    Route::post('/resetPassword', [CambiarContraseñaController::class, 'resetPassword']);
});
Route::post('auth/google', [GoogleController::class, 'loginWithGoogle']);

// Group company but it not necessary to be logged
Route::get('company/{slug}', [CompanyController::class, 'getCompany'])->name('company.getCompany');
Route::post('company/checkCompanyUser', [CompanyController::class, 'checkCompanyUser'])->name('company.checkCompanyUser');
Route::get('student/{uuid}', [StudentController::class, 'getStudent'])->name('get.student');
Route::get('/allCompanies', [CompanyController::class, 'allCompanies'])->name('all.companies');
Route::get('institution/getInstitutions', [InstitutionController::class, 'getInstitutions'])->name('institution.getInstitutions');
Route::post('/followers', [FollowerController::class, 'getFollowersUser']);
Route::post('users/all', [UserController::class, 'getAllUsers'])->name('user.all');
Route::get('/publications', [PublicationsController::class, 'index']);
Route::get('/publications/{publicationId}/comments', [PublicationsCommentController::class, 'index']);


Route::prefix('/skills')->group(function () {
    Route::get('/', [SkillsController::class, 'getSkills']);
});

Route::prefix('/sectors')->group(function () {
    Route::get('/', [SectorController::class, 'getSectors']);
});

Route::prefix('/page')->group(function () {
    Route::get('/register', [PagesController::class, 'registerPage']);
    Route::get('/search', [PagesController::class, 'searchPractices']);
    Route::post('/search-filtered', [PagesController::class, 'searchPracticeFiltered']);
    Route::get('/profile/company', [PagesController::class, 'profileCompany']);
});


Route::prefix('/institution')->group(function () {
    // Public routes
    Route::get('/', [InstitutionController::class, 'index'])->name('institution.index');
    Route::get('/{slug}', [InstitutionController::class, 'getInstitution'])->name('institution.getInstitution');
    Route::get('/custom/{customUrl}', [InstitutionController::class, 'getByCustomUrl'])->name('institution.getByCustomUrl');
    Route::get('/id/{id}', [InstitutionController::class, 'show'])->name('institution.show');
});

//RUTAS PROTEGIDAS
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/auth/check', [AuthController::class, 'check'])->name('auth.check');

    // Rutas para guardar y obtener publicaciones guardadas
    Route::post('/publications/{publicationId}/save', [PublicationsController::class, 'toggleSave']);
    Route::get('/publications/saved', [PublicationsController::class, 'getSavedPublications']);

    Route::prefix('/notifications')->group(function () {
        // Obtener todas las notificaciones
        Route::get('/', [NotificationController::class, 'index']);
        // Obtener solo notificaciones no leídas
        Route::get('/unread', [NotificationController::class, 'unread']);
        // Marcar una notificación específica como leída
        Route::patch('/{notification}/read', [NotificationController::class, 'markAsRead']);
        // Marcar todas las notificaciones como leídas
        Route::patch('/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    });



    Route::prefix('/users')->group(function () {
        Route::post('/update', [UserController::class, 'update'])->name('user.update');
        Route::post('/delete', [UserController::class, 'delete'])->name('user.delete');
        Route::get('/info', [UserController::class, 'getUser'])->name('get.user');
        Route::post('/deactivate', [UserController::class, 'deactivate'])->name('user.deactivate');
        Route::post('/activate', [UserController::class, 'activate'])->name('user.activate');
        // obtener todos los usuarios para que puedo mostrar el perfiles de los usuarios en la parte de publicaciones

    });

    Route::prefix('/student')->group(function () {
        Route::post('update', [StudentController::class, 'update'])->name('student.update');
        Route::post('delete', [StudentController::class, 'delete'])->name('student.delete');
        Route::post('/deactivate', [StudentController::class, 'deactivate'])->name('student.deactivate');
        Route::post('/getEducationById', [StudentController::class, 'getEducationById'])->name('get.education');
        Route::get('/offer/get-data', [StudentController::class, 'getOfferData'])->name('get.offer.data');
    });
    Route::prefix('/company')->group(function () {
        Route::post('/update', [CompanyController::class, 'update'])->name('company.update');
        Route::post('/delete', [CompanyController::class, 'delete'])->name('company.delete');
    });

    Route::prefix('/institution')->group(function () {
        // Protected routes that require authentication
        Route::post('/store', [InstitutionController::class, 'store'])->name('institution.store');
        Route::post('/update', [InstitutionController::class, 'update'])->name('institution.update');
        Route::delete('/{id}', [InstitutionController::class, 'destroy'])->name('institution.delete');
        Route::post('/checkOwner', [InstitutionController::class, 'checkOwner'])->name('institution.checkOwner');
    });
    Route::prefix('/institution')->group(function () {
        Route::post('/update', [InstitutionController::class, 'update'])->name('institution.update');
        Route::post('/delete', [InstitutionController::class, 'delete'])->name('institution.delete');
        Route::get('/', [InstitutionController::class, 'index'])->name('institution.index');
        Route::post('/store', [InstitutionController::class, 'store'])->middleware('auth:sanctum')->name('institution.store');
        Route::get('/{id}', [InstitutionController::class, 'show'])->name('institution.show');
        Route::post('/update', [InstitutionController::class, 'update'])->middleware('auth:sanctum')->name('institution.update');
        Route::delete('/{id}', [InstitutionController::class, 'destroy'])->middleware('auth:sanctum')->name('institution.delete');
    });

    Route::prefix('/education')->group(function () {
        Route::post('/create', [StudentEducationController::class, 'create'])->name('create.education');
        Route::post('/update', [StudentEducationController::class, 'update'])->name('update.education');
        Route::delete('/delete', [StudentEducationController::class, 'delete'])->name('delete.education');
    });

    Route::prefix('/experience')->group(function () {
        Route::post('/create', [ExperienceController::class, 'create'])->name('create.experience');
        Route::post('/update', [ExperienceController::class, 'update'])->name('update.experience');
        Route::delete('/delete', [ExperienceController::class, 'delete'])->name('delete.experience');
    });

    Route::prefix('/projects')->group(function () {
        Route::post('/create', [ProjectController::class, 'create'])->name('create.project');
        Route::post('/update', [ProjectController::class, 'update'])->name('update.project');
        Route::delete('/delete', [ProjectController::class, 'delete'])->name('delete.project');
    });

    Route::prefix('/skill')->group(function () {
        Route::post('/create', [SkillController::class, 'create'])->name('create.skill');
        Route::post('/assignment', [SkillController::class, 'assignment'])->name('assignment.skill');
    });

    Route::prefix('/offers')->group(function () {
        Route::get('/{id}', [OfferController::class, 'show'])->name('offer.get');
        Route::post('/create', [OfferController::class, 'create'])->name('offers.create');
        Route::post('/update', [OfferController::class, 'update'])->name('offers.update');
        Route::post('/delete', [OfferController::class, 'delete'])->name('offers.delete');
        Route::post('/apply', [OfferController::class, 'apply'])->name('offers.apply');
        Route::post('/apply/update/status', [OfferController::class, 'applyUpdateStatus'])->name('offers.rejected');
        Route::get('/apply-check/{offer_id}', [OfferController::class, 'applyCheck'])->name('offers.applyCheck');
    });

    Route::prefix('/courses')->group(function () {
        Route::get('/getCourses', [CoursesController::class, 'getCourses'])->name('get.courses');
    });

    Route::prefix('/chats')->group(function () {
        Route::get('/my-direct-messages', [ChatController::class, 'getDirectChats'])->name('chat.myMessages');
        Route::get('/get-or-create-direct-chat/{userId}', [ChatController::class, 'getOrCreateDirectChat'])->name('chat.getOrCreateDirectChat');
        Route::get('/suggested-direct-chat', [ChatController::class, 'suggestedDirectChat'])->name('chat.suggestedDirectChat');
        Route::post('/send-direct-chat', [ChatController::class, 'sendDirectMessage'])->name('chat.sendDirectMessage');
        Route::get('/bookmarked/{directChatId}', [ChatController::class, 'bookMarkDirectChat'])->name('chat.bookMarkDirectChat');
        Route::get('/saved/{directChatId}', [ChatController::class, 'savedDirectChat'])->name('chat.savedDirectChat');
    });

    // Rutas de seguidores
    Route::post('/follow', [FollowerController::class, 'follow']);
    Route::delete('/unfollow/{user_id}', [FollowerController::class, 'unfollow']);
    Route::put('/follow/approve/{follower_id}', [FollowerController::class, 'approveFollowRequest']);
    Route::delete('/follow/reject/{follower_id}', [FollowerController::class, 'rejectFollowRequest']);
    Route::post('/block', [FollowerController::class, 'blockUser']);
    Route::get('/unblock/{user_id}', [FollowerController::class, 'unblockUser']);
    Route::get('/following', [FollowerController::class, 'getFollowing']);
    Route::get('/follow/check/{user_id}', [FollowerController::class, 'followCheck']);
    Route::get('/my-followers', [FollowerController::class, 'getMyFollowers']);
    Route::get('/follow-requests/pending', [FollowerController::class, 'getPendingFollowRequests']);
    Route::get('/follow-requests/sent', [FollowerController::class, 'getPendingSentRequests']);
    Route::get('/blocked', [FollowerController::class, 'getBlockedUsers']);

    // Rutas para configuración de la cuenta
    Route::prefix('/settings')->group(function () {
        Route::put('/toggle-account-privacy', [UserSettingsController::class, 'toggleAccountPrivacy']);
        Route::get('/account-status', [UserSettingsController::class, 'getAccountStatus']);
        Route::get('/profile', [UserSettingsController::class, 'getProfile']);
        Route::post('/profile/new-password', [UserSettingsController::class, 'updatePassword']);
        Route::post('/profile/new-email', [UserSettingsController::class, 'updateEmail']);
    });

    // Rutas de publicaciones
    Route::post('/publications', [PublicationsController::class, 'store']);
    Route::get('/publications/{id}', [PublicationsController::class, 'show']);
    Route::put('/publications/{id}', [PublicationsController::class, 'update']);
    Route::delete('/publications/{id}', [PublicationsController::class, 'destroy']);

    // Publicaciones del usuario actual
    Route::get('/my-publications', [PublicationsController::class, 'myPublications']);
    Route::get('/my-liked-publications', [PublicationsController::class, 'myLikedPublications']);
    // Likes
    Route::post('/publications/{publicationId}/like', [PublicationsController::class, 'toggleLike']);
    // Comentarios (NUEVAS RUTAS)
    Route::post('/publications/{publicationId}/comments', [PublicationsCommentController::class, 'store']);
    Route::delete('/publications/{publicationId}/comments/{commentId}', [PublicationsCommentController::class, 'destroy']);

    Route::prefix('/help')->group(function () {
        Route::post('/send-help', [HelpUserController::class, 'sendHelp']);
    });
    Route::get('my-blocked-users', [HelpUserController::class, 'getMyBlockedUsers']);

    Route::post('/publications/share', [SharedPublicationController::class, 'share']);
    Route::delete('/shared-publications/{id}', [SharedPublicationController::class, 'delete']);
    
});


    // Rutas para publicaciones compartidas
    Route::get('/users/{userId}/shared-publications', [SharedPublicationController::class, 'getUserSharedPublications']);
