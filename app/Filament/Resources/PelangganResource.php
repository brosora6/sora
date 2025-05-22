<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PelangganResource\Pages;
use App\Filament\Resources\PelangganResource\RelationManagers;
use App\Models\Pelanggan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;

class PelangganResource extends Resource
{
    protected static ?string $model = Pelanggan::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationGroup = 'User Management';
    protected static ?int $navigationSort = 3;

    public static function shouldRegisterNavigation(): bool
    {
        return auth()->user() instanceof \App\Models\SuperAdmin;
    }

    public static function canCreate(): bool
    {
        return auth()->user() instanceof \App\Models\SuperAdmin;
    }

    public static function canEdit(Model $record): bool
    {
        return auth()->user() instanceof \App\Models\SuperAdmin;
    }

    public static function canDelete(Model $record): bool
    {
        return auth()->user() instanceof \App\Models\SuperAdmin;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->minLength(3)
                    ->regex('/^[a-zA-Z\s]+$/')
                    ->validationMessages([
                        'regex' => 'Nama hanya boleh berisi huruf dan spasi',
                        'min' => 'Nama minimal 3 karakter',
                    ]),
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true)
                    ->regex('/^[a-zA-Z0-9._%+-]+@gmail\.com$/')
                    ->validationMessages([
                        'unique' => 'Email sudah terdaftar',
                        'regex' => 'Email harus menggunakan domain Gmail (@gmail.com)',
                    ]),
                Forms\Components\TextInput::make('no_telepon')
                    ->tel()
                    ->required()
                    ->maxLength(15)
                    ->minLength(10)
                    ->regex('/^08[0-9]{8,13}$/')
                    ->validationMessages([
                        'regex' => 'Nomor telepon harus dimulai dengan 08 dan diikuti 8-13 digit angka',
                        'min' => 'Nomor telepon minimal 10 digit',
                        'max' => 'Nomor telepon maksimal 15 digit',
                    ]),
                Forms\Components\Section::make('Password')
                    ->schema([
                        Forms\Components\TextInput::make('password')
                            ->password()
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $context): bool => $context === 'create')
                            ->minLength(8)
                            ->maxLength(255)
                            ->regex('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/')
                            ->confirmed()
                            ->autocomplete('new-password')
                            ->label(fn (string $context): string => $context === 'edit' ? 'New Password' : 'Password')
                            ->validationMessages([
                                'min' => 'Password minimal 8 karakter',
                                'regex' => 'Password harus mengandung huruf besar, huruf kecil, dan angka',
                            ]),
                        Forms\Components\TextInput::make('password_confirmation')
                            ->password()
                            ->required(fn (string $context): bool => $context === 'create')
                            ->maxLength(255)
                            ->dehydrated(false)
                            ->label(fn (string $context): string => $context === 'edit' ? 'Confirm New Password' : 'Confirm Password'),
                    ])
                    ->columns(2),
                Forms\Components\FileUpload::make('profile_photo')
                    ->image()
                    ->disk('public_store')
                    ->visibility('public')
                    ->imageEditor()
                    ->circleCropper()
                    ->imageResizeMode('cover')
                    ->imageCropAspectRatio('1:1')
                    ->imageResizeTargetWidth('300')
                    ->imageResizeTargetHeight('300')
                    ->maxSize(5120) // 5MB
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg'])
                    ->validationMessages([
                        'maxSize' => 'Ukuran file maksimal 5MB',
                        'acceptedFileTypes' => 'Format file harus JPG, JPEG, atau PNG',
                    ])
                    ->label('Profile Photo'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('profile_photo')
                    ->disk('public_store')
                    ->circular()
                    ->defaultImageUrl('/images/placeholder.jpg')
                    ->size(40),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('no_telepon')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make()
                    ->visible(fn () => auth()->user() instanceof \App\Models\SuperAdmin),
                Tables\Actions\DeleteAction::make()
                    ->visible(fn () => auth()->user() instanceof \App\Models\SuperAdmin),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->visible(fn () => auth()->user() instanceof \App\Models\SuperAdmin),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPelanggans::route('/'),
            'create' => Pages\CreatePelanggan::route('/create'),
            'edit' => Pages\EditPelanggan::route('/{record}/edit'),
        ];
    }
}
