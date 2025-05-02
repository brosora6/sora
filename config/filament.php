<?php

return [
    'auth' => [
        'panels' => [
            'admin' => [
                'guard' => 'admin',
                'model' => \App\Models\Admin::class,
            ],
            'superadmin' => [
                'guard' => 'superadmin',
                'model' => \App\Models\SuperAdmin::class,
            ],
        ],
    ],
]; 