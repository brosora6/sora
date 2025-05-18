<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class CustomerResetPasswordNotification extends Notification
{
    use Queueable;

    /**
     * The password reset token.
     *
     * @var string
     */
    public $token;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $count = config('auth.passwords.customers.expire');
        $appUrl = config('app.url');
        
        return (new MailMessage)
            ->subject('Konfirmasi Akun - Rumah Makan Salwa')
            ->greeting('Halo ' . $notifiable->name)
            ->line('Anda telah meminta verifikasi akun di Rumah Makan Salwa.')
            ->line('Untuk melanjutkan proses verifikasi, silakan kunjungi halaman berikut:')
            ->action('Verifikasi Akun', url(route('customer.password.reset', [
                'token' => $this->token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false)))
            ->line("Tautan ini hanya berlaku untuk {$count} menit ke depan.")
            ->line('Jika Anda tidak meminta verifikasi ini, Anda dapat mengabaikan pesan ini.')
            ->line("Untuk informasi lebih lanjut, kunjungi {$appUrl}/bantuan")
            ->line('Ini adalah pesan otomatis, mohon tidak membalas email ini.')
            ->salutation('Salam,')
            ->salutation('Rumah Makan Salwa');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
} 