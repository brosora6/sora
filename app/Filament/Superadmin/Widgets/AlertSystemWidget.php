<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Reservation;
use App\Models\Payment;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AlertSystemWidget extends BaseWidget
{
    protected static ?string $heading = 'Notifikasi Sistem';
    protected static ?int $sort = 7;
    protected int $defaultPaginationPageSize = 5;
    protected int | string | array $columnSpan = 6;

    public function getTableRecordKey(Model $record): string
    {
        return $record->alert_id;
    }

    protected function getTableQuery(): Builder
    {
        // Get pending reservations
        $pendingReservations = Reservation::where('status', 'pending')
            ->with('pelanggan')
            ->get()
            ->map(function ($reservation) {
                return [
                    'alert_id' => 'res_' . $reservation->id,
                    'type' => 'Reservasi',
                    'message' => "Reservasi baru dari {$reservation->pelanggan->name} untuk {$reservation->jumlah_orang} orang pada " . 
                        date('d M Y', strtotime($reservation->tanggal)) . " pukul " . 
                        date('H:i', strtotime($reservation->waktu)),
                    'created_at' => $reservation->created_at,
                    'source_id' => $reservation->id,
                    'source_type' => 'reservation'
                ];
            });

        // Get pending payments
        $pendingPayments = Payment::where('status', 'pending')
            ->with('pelanggan')
            ->get()
            ->map(function ($payment) {
                return [
                    'alert_id' => 'pay_' . $payment->id,
                    'type' => 'Pembayaran',
                    'message' => "Menunggu konfirmasi pembayaran" . 
                        (isset($payment->pelanggan) ? " dari {$payment->pelanggan->name}" : "") . 
                        " sebesar Rp " . number_format($payment->total_amount, 0, ',', '.'),
                    'created_at' => $payment->created_at,
                    'source_id' => $payment->id,
                    'source_type' => 'payment'
                ];
            });

        // Combine all alerts
        $allAlerts = $pendingReservations->concat($pendingPayments)
            ->sortByDesc('created_at');

        // If there are no alerts, return an empty query
        if ($allAlerts->isEmpty()) {
            return Reservation::whereRaw('1 = 0');
        }

        // Create alert queries
        $queries = [];
        foreach ($allAlerts as $alert) {
            $queries[] = DB::table(DB::raw('(SELECT 1) as dummy'))
                ->select([
                    DB::raw('CAST(\'' . $alert['source_id'] . '\' AS BIGINT) as id'),
                    DB::raw('null::varchar as order_number'),
                    DB::raw('null::bigint as pelanggan_id'),
                    DB::raw('null::date as tanggal'),
                    DB::raw('null::time as waktu'),
                    DB::raw('null::integer as jumlah_orang'),
                    DB::raw('null::text as note'),
                    DB::raw('null::varchar as status'),
                    DB::raw('\'' . $alert['type'] . '\' as type'),
                    DB::raw('\'' . str_replace("'", "''", $alert['message']) . '\' as message'),
                    DB::raw('\'' . $alert['created_at'] . '\'::timestamp as created_at'),
                    DB::raw('null::timestamp as updated_at'),
                    DB::raw('\'' . $alert['source_type'] . '\' as source_type'),
                    DB::raw('\'' . $alert['source_id'] . '\' as source_id'),
                    DB::raw('\'' . $alert['alert_id'] . '\' as alert_id')
                ]);
        }

        // Build the union query
        $baseQuery = Reservation::withoutGlobalScopes()
            ->select([
                'id',
                'order_number',
                'pelanggan_id',
                'tanggal',
                'waktu',
                'jumlah_orang',
                'note',
                'status',
                DB::raw('null as type'),
                DB::raw('null as message'),
                'created_at',
                'updated_at',
                DB::raw('null as source_type'),
                DB::raw('null as source_id'),
                DB::raw('CAST(id AS VARCHAR) as alert_id')
            ])
            ->whereRaw('1 = 0');

        // Add unions
        foreach ($queries as $query) {
            $baseQuery->union($query);
        }

        return $baseQuery;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query($this->getTableQuery())
            ->columns([
                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Reservasi' => 'success',
                        'Pembayaran' => 'warning',
                        default => 'info',
                    }),
                TextColumn::make('message')
                    ->label('Detail')
                    ->wrap(),
                TextColumn::make('created_at')
                    ->label('Waktu')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc');
    }
} 