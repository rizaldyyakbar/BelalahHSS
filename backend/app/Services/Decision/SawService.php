<?php

namespace App\Services\Decision;

class SawService
{
    /**
     * @param  array<int, array{id: mixed, values: array<string, float|int>}>  $alternatives
     * @param  array<int, array{key: string, weight: float|int, type: string}>  $criteria
     * @return array<int, array{id: mixed, score: float, normalized: array<string, float>, values: array<string, float|int>}>
     */
    public function rank(array $alternatives, array $criteria): array
    {
        $extremes = $this->buildExtremes($alternatives, $criteria);
        $ranked = [];

        foreach ($alternatives as $alternative) {
            $normalized = [];
            $score = 0.0;

            foreach ($criteria as $criterion) {
                $key = $criterion['key'];
                $weight = (float) $criterion['weight'];
                $type = strtolower((string) $criterion['type']);
                $value = (float) ($alternative['values'][$key] ?? 0.0);

                $normalizedValue = $this->normalize($value, $type, $extremes[$key] ?? ['min' => 0.0, 'max' => 0.0]);

                $normalized[$key] = $normalizedValue;
                $score += $normalizedValue * $weight;
            }

            $ranked[] = [
                'id' => $alternative['id'],
                'score' => $score,
                'normalized' => $normalized,
                'values' => $alternative['values'],
            ];
        }

        usort($ranked, fn (array $a, array $b): int => $b['score'] <=> $a['score']);

        return $ranked;
    }

    /**
     * @param  array<int, array{id: mixed, values: array<string, float|int>}>  $alternatives
     * @param  array<int, array{key: string, weight: float|int, type: string}>  $criteria
     * @return array<string, array{min: float, max: float}>
     */
    protected function buildExtremes(array $alternatives, array $criteria): array
    {
        $extremes = [];

        foreach ($criteria as $criterion) {
            $key = $criterion['key'];
            $values = [];

            foreach ($alternatives as $alternative) {
                $values[] = (float) ($alternative['values'][$key] ?? 0.0);
            }

            $extremes[$key] = [
                'min' => empty($values) ? 0.0 : min($values),
                'max' => empty($values) ? 0.0 : max($values),
            ];
        }

        return $extremes;
    }

    /**
     * @param  array{min: float, max: float}  $extreme
     */
    protected function normalize(float $value, string $type, array $extreme): float
    {
        $min = $extreme['min'];
        $max = $extreme['max'];

        if ($type === 'cost') {
            if ($value <= 0.0) {
                return 0.0;
            }

            return $min <= 0.0 ? 0.0 : $min / $value;
        }

        if ($max <= 0.0) {
            return 0.0;
        }

        return $value / $max;
    }
}