<?php

namespace App\Providers\Filament;

use App\Filament\Resources\AdminResource;
use App\Filament\Resources\CartResource;
use App\Filament\Resources\MenuResource;
use App\Filament\Resources\CategoryResource;
use App\Filament\Resources\PaymentResource;
use App\Filament\Resources\PelangganResource;
use App\Filament\Resources\ReservationResource;
use App\Filament\Resources\SuperAdminResource;
use App\Filament\Superadmin\Pages\Login;
use App\Filament\Superadmin\Widgets\OrderSummaryWidget;
use App\Filament\Superadmin\Widgets\MenuPerformanceWidget;
use App\Filament\Superadmin\Widgets\PaymentTransactionsWidget;
use App\Filament\Superadmin\Widgets\ReservationMonitoringWidget;
use App\Filament\Superadmin\Widgets\CartAnalyticsWidget;
use App\Filament\Superadmin\Widgets\CustomerInsightsWidget;
use App\Filament\Superadmin\Widgets\AlertSystemWidget;
use App\Filament\Superadmin\Widgets\SalesRevenueChart;
use App\Filament\Superadmin\Widgets\CategoryRevenueChart;
use App\Filament\Superadmin\Widgets\ProductRevenueDonutChart;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class SuperadminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('superadmin')
            ->path('superadmin')
            ->login(Login::class)
            ->authGuard('superadmin')
            ->colors([
                'primary' => Color::Indigo,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->resources([
                SuperAdminResource::class,
                AdminResource::class,
                PelangganResource::class,
                MenuResource::class,
                CartResource::class,
                ReservationResource::class,
                PaymentResource::class,
                CategoryResource::class,
            ])
            ->discoverPages(in: app_path('Filament/Superadmin/Pages'), for: 'App\\Filament\\Superadmin\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Superadmin/Widgets'), for: 'App\\Filament\\Superadmin\\Widgets')
            ->widgets([
                OrderSummaryWidget::class,
                MenuPerformanceWidget::class,
                PaymentTransactionsWidget::class,
                ReservationMonitoringWidget::class,
                CartAnalyticsWidget::class,
                CustomerInsightsWidget::class,
                AlertSystemWidget::class,
                SalesRevenueChart::class,
                CategoryRevenueChart::class,
                ProductRevenueDonutChart::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
                'auth.session:superadmin',
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->maxContentWidth('full')
            ->topNavigation()
            ->sidebarCollapsibleOnDesktop();
    }
}
