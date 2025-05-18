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
                    ->required(),
                Forms\Components\DatePicker::make('tanggal')
                    ->required()
                    ->native(false)
                    ->closeOnDateSelection(),
                Forms\Components\TimePicker::make('waktu')
                    ->required()
                    ->native(false)
                    ->format('H:i')
                    ->hoursStep(1)
                    ->minutesStep(30)
                    ->displayFormat('H:i')
                    ->label('Waktu'),
                Forms\Components\TextInput::make('jumlah_orang')
                    ->required()
                    ->numeric()
                    ->minValue(1)
                    ->maxValue(20)
                    ->label('Number of People'),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'rejected' => 'Rejected',
                    ])
                    ->required()
                    ->default('pending')
                    ->native(false),
                Forms\Components\Textarea::make('note')
                    ->label('Note')
                    ->rows(3),
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
