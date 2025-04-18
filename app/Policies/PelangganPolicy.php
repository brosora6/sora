<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\SuperAdmin;
use App\Models\Pelanggan;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;

class PelangganPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny($user): bool
    {
        // Only allow SuperAdmins to view Pelanggan records
        return Auth::guard('superadmin')->check();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view($user, Pelanggan $pelanggan): bool
    {
        return Auth::guard('superadmin')->check();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create($user): bool
    {
        return Auth::guard('superadmin')->check();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update($user, Pelanggan $pelanggan): bool
    {
        return Auth::guard('superadmin')->check();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete($user, Pelanggan $pelanggan): bool
    {
        return Auth::guard('superadmin')->check();
    }
} 