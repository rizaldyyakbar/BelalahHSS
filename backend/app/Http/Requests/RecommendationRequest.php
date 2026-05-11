<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecommendationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'pretty' => ['sometimes'],
            'sort' => ['sometimes', 'in:score,distance'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'lat.required' => 'Latitude (lat) is required.',
            'lng.required' => 'Longitude (lng) is required.',
            'lat.between' => 'Latitude (lat) must be between -90 and 90.',
            'lng.between' => 'Longitude (lng) must be between -180 and 180.',
            'sort.in' => 'Sort must be either score or distance.',
        ];
    }
}
