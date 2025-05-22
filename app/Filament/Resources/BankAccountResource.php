<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BankAccountResource\Pages;
use App\Models\BankAccount;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BankAccountResource extends Resource
{
    protected static ?string $model = BankAccount::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';

    protected static ?string $navigationGroup = 'Settings';

    protected static ?string $modelLabel = 'Bank Account';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('bank_name')
                    ->required()
                    ->maxLength(255)
                    ->minLength(3)
                    ->regex('/^[a-zA-Z\s\-]+$/')
                    ->validationMessages([
                        'required' => 'The bank name is required.',
                        'min' => 'The bank name must be at least 3 characters.',
                        'max' => 'The bank name cannot exceed 255 characters.',
                        'regex' => 'The bank name can only contain letters, spaces, and hyphens.',
                    ])
                    ->helperText('Enter the full name of the bank'),
                
                Forms\Components\TextInput::make('account_number')
                    ->required()
                    ->maxLength(20)
                    ->minLength(10)
                    ->regex('/^[0-9]+$/')
                    ->validationMessages([
                        'required' => 'The account number is required.',
                        'min' => 'The account number must be at least 10 digits.',
                        'max' => 'The account number cannot exceed 20 digits.',
                        'regex' => 'The account number can only contain numbers.',
                    ])
                    ->helperText('Enter the bank account number (10-20 digits)'),
                
                Forms\Components\TextInput::make('account_name')
                    ->required()
                    ->maxLength(255)
                    ->minLength(3)
                    ->regex('/^[a-zA-Z\s\-]+$/')
                    ->validationMessages([
                        'required' => 'The account name is required.',
                        'min' => 'The account name must be at least 3 characters.',
                        'max' => 'The account name cannot exceed 255 characters.',
                        'regex' => 'The account name can only contain letters, spaces, and hyphens.',
                    ])
                    ->helperText('Enter the name of the account holder'),
                
                Forms\Components\Textarea::make('description')
                    ->maxLength(500)
                    ->validationMessages([
                        'max' => 'The description cannot exceed 500 characters.',
                    ])
                    ->helperText('Optional: Add any additional information about this bank account'),
                
                Forms\Components\Toggle::make('is_active')
                    ->label('Active Status')
                    ->helperText('Toggle to activate or deactivate this bank account')
                    ->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('bank_name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('account_number')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('account_name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
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
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Status')
                    ->placeholder('All Accounts')
                    ->trueLabel('Active Only')
                    ->falseLabel('Inactive Only'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBankAccounts::route('/'),
            'create' => Pages\CreateBankAccount::route('/create'),
            'edit' => Pages\EditBankAccount::route('/{record}/edit'),
        ];
    }
} 