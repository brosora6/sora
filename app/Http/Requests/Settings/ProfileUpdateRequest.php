<?php

namespace App\Http\Requests\Settings;

use App\Models\Pelanggan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(Pelanggan::class)->ignore(Auth::guard('customer')->id()),
            ],
            'no_telepon' => ['required', 'string', 'regex:/^08\d{9,11}$/'],
            'profile_photo' => ['nullable', 'image', 'max:2048'],
            'remove_photo' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'profile_photo.max' => 'The profile photo must not be larger than 2MB.',
            'profile_photo.image' => 'The file must be an image (jpeg, png, bmp, gif, svg, or webp).',
            'no_telepon.required' => 'The phone number field is required.',
            'no_telepon.regex' => 'Please enter a valid Indonesian phone number starting with 08 followed by 9-11 digits.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean up phone number input
        if ($this->has('no_telepon')) {
            $phone = $this->input('no_telepon');
            // Remove any whitespace and non-digit characters
            $phone = preg_replace('/[^0-9]/', '', $phone);
            $this->merge(['no_telepon' => $phone]);
        }

        // Merge other fields if not present
        if (!$this->has('name')) {
            $this->merge(['name' => Auth::guard('customer')->user()->name]);
        }
        if (!$this->has('email')) {
            $this->merge(['email' => Auth::guard('customer')->user()->email]);
        }
    }
}
