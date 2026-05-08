<?php

namespace App\Services\Geo;

class HaversineService
{
    public function distanceKm(float $latitudeFrom, float $longitudeFrom, float $latitudeTo, float $longitudeTo): float
    {
        $earthRadiusKm = 6371.0;

        $latFrom = deg2rad($latitudeFrom);
        $lonFrom = deg2rad($longitudeFrom);
        $latTo = deg2rad($latitudeTo);
        $lonTo = deg2rad($longitudeTo);

        $deltaLatitude = $latTo - $latFrom;
        $deltaLongitude = $lonTo - $lonFrom;

        $a = sin($deltaLatitude / 2) ** 2
            + cos($latFrom) * cos($latTo) * sin($deltaLongitude / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadiusKm * $c;
    }
}