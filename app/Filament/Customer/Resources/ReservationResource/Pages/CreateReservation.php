<?php

namespace App\Filament\Customer\Resources\ReservationResource\Pages;

use App\Filament\Customer\Resources\ReservationResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;

class CreateReservation extends CreateRecord
{
    protected static string $resource = ReservationResource::class;

    protected function mutateFormData(array $data): array
    {
        $data['pelanggan_id'] = Auth::guard('customer')->id();
        return $data;
    }
} 