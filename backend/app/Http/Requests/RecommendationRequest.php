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
            'mode' => ['sometimes', 'in:near_user,around_destination'],
            'destination_id' => ['required_if:mode,around_destination', 'integer', 'exists:destinations,id'],
            'lat' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'lng' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'radius_meters' => ['sometimes', 'integer', 'min:500', 'max:100000'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
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
            'lat.between' => 'Latitude (lat) must be between -90 and 90.',
            'lng.between' => 'Longitude (lng) must be between -180 and 180.',
            'mode.in' => 'Mode must be either near_user or around_destination.',
            'destination_id.required_if' => 'destination_id is required for around_destination mode.',
            'destination_id.exists' => 'destination_id must reference an existing destination.',
            'sort.in' => 'Sort must be either score or distance.',
        ];
    }
}
