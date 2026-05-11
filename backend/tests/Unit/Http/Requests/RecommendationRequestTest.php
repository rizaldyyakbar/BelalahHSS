<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\RecommendationRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class RecommendationRequestTest extends TestCase
{
    public function test_rules_pass_for_valid_payload(): void
    {
        $request = new RecommendationRequest();

        $validator = Validator::make(
            [
                'lat' => -6.2,
                'lng' => 106.8,
                'limit' => 5,
                'sort' => 'distance',
                'pretty' => 1,
            ],
            $request->rules(),
            $request->messages(),
        );

        $this->assertFalse($validator->fails());
    }

    public function test_rules_fail_when_required_coordinates_missing(): void
    {
        $request = new RecommendationRequest();

        $validator = Validator::make([], $request->rules(), $request->messages());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('lat', $validator->errors()->messages());
        $this->assertArrayHasKey('lng', $validator->errors()->messages());
    }

    public function test_rules_fail_when_coordinates_out_of_range(): void
    {
        $request = new RecommendationRequest();

        $validator = Validator::make(
            [
                'lat' => -99,
                'lng' => 300,
            ],
            $request->rules(),
            $request->messages(),
        );

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('lat', $validator->errors()->messages());
        $this->assertArrayHasKey('lng', $validator->errors()->messages());
    }

    public function test_rules_fail_for_invalid_sort_and_limit(): void
    {
        $request = new RecommendationRequest();

        $validator = Validator::make(
            [
                'lat' => -6.2,
                'lng' => 106.8,
                'limit' => 0,
                'sort' => 'random',
            ],
            $request->rules(),
            $request->messages(),
        );

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('limit', $validator->errors()->messages());
        $this->assertArrayHasKey('sort', $validator->errors()->messages());
    }

    public function test_rules_fail_for_around_destination_mode_without_destination_id(): void
    {
        $request = new RecommendationRequest();

        $validator = Validator::make(
            [
                'mode' => 'around_destination',
                'limit' => 10,
            ],
            $request->rules(),
            $request->messages(),
        );

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('destination_id', $validator->errors()->messages());
    }
}
