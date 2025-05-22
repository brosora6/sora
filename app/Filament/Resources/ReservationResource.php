<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReservationResource\Pages;
use App\Filament\Resources\ReservationResource\RelationManagers;
use App\Models\Reservation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ReservationResource extends Resource
{
    protected static ?string $model = Reservation::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $navigationGroup = 'Restaurant Management';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('order_number')
                    ->label('Order Number')
                    ->disabled()
                    ->dehydrated(false)
                    ->visible(fn (string $context): bool => $context === 'edit'),
                Forms\Components\Select::make('pelanggan_id')
                    ->relationship('pelanggan', 'name')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->validationMessages([
                        'required' => 'Please select a customer.',
                    ])
                    ->helperText('Select the customer making the reservation'),
                Forms\Components\DatePicker::make('tanggal')
                    ->required()
                    ->native(false)
                    ->closeOnDateSelection()
                    ->minDate(now())
                    ->maxDate(now()->addMonths(3))
                    ->validationMessages([
                        'required' => 'Please select a date for the reservation.',
                        'min' => 'Reservation date cannot be in the past.',
                        'max' => 'Reservation cannot be made more than 3 months in advance.',
                    ])
                    ->helperText('Select a date between today and 3 months from now'),
                Forms\Components\TimePicker::make('waktu')
                    ->required()
                    ->native(false)
                    ->format('H:i')
                    ->hoursStep(1)
                    ->minutesStep(30)
                    ->displayFormat('H:i')
                    ->label('Waktu')
                    ->validationMessages([
                        'required' => 'Please select a time for the reservation.',
                    ])
                    ->helperText('Select your preferred time (30-minute intervals)'),
                Forms\Components\TextInput::make('jumlah_orang')
                    ->required()
                    ->numeric()
                    ->minValue(1)
                    ->maxValue(20)
                    ->label('Number of People')
                    ->validationMessages([
                        'required' => 'Please enter the number of people.',
                        'min' => 'Minimum reservation is for 1 person.',
                        'max' => 'Maximum reservation is for 20 people.',
                        'numeric' => 'Please enter a valid number.',
                    ])
                    ->helperText('Enter number of people (1-20)'),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'rejected' => 'Rejected',
                    ])
                    ->required()
                    ->default('pending')
                    ->native(false)
                    ->validationMessages([
                        'required' => 'Please select a status.',
                    ])
                    ->helperText('Select the reservation status'),
                Forms\Components\Textarea::make('note')
                    ->label('Note')
                    ->rows(3)
                    ->maxLength(500)
                    ->validationMessages([
                        'max' => 'The note cannot exceed 500 characters.',
                    ])
                    ->helperText('Optional: Add any special requests or notes (max 500 characters)'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->label('Order Number'),
                Tables\Columns\TextColumn::make('pelanggan.name')
                    ->searchable()
                    ->sortable()
                    ->label('Customer'),
                Tables\Columns\TextColumn::make('tanggal')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('waktu')
                    ->formatStateUsing(function ($state) {
                        $hour = (int) date('H', strtotime($state));
                        $period = match(true) {
                            $hour >= 3 && $hour < 10 => 'Pagi',
                            $hour >= 10 && $hour < 15 => 'Siang',
                            $hour >= 15 && $hour < 18 => 'Sore',
                            default => 'Malam'
                        };
                        return date('H:i', strtotime($state)) . ' ' . $period;
                    })
                    ->sortable()
                    ->label('Waktu'),
                Tables\Columns\TextColumn::make('jumlah_orang')
                    ->numeric()
                    ->sortable()
                    ->label('Number of People'),
                Tables\Columns\SelectColumn::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'rejected' => 'Rejected',
                    ])
                    ->sortable(),
                Tables\Columns\TextColumn::make('note')
                    ->label('Note')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'rejected' => 'Rejected',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListReservations::route('/'),
            'create' => Pages\CreateReservation::route('/create'),
            'edit' => Pages\EditReservation::route('/{record}/edit'),
        ];
    }
}
