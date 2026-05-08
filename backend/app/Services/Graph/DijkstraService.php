<?php

namespace App\Services\Graph;

class DijkstraService
{
    /**
     * @param  array<string|int, array<string|int, float|int>>  $graph
     * @return array{distance: float, path: array<int, string|int>}
     */
    public function shortestPath(array $graph, string|int $source, string|int $target): array
    {
        $distances = [];
        $previous = [];
        $unvisited = [];

        foreach ($graph as $node => $edges) {
            $distances[$node] = INF;
            $previous[$node] = null;
            $unvisited[$node] = true;
        }

        if (! array_key_exists($source, $graph) || ! array_key_exists($target, $graph)) {
            return ['distance' => INF, 'path' => []];
        }

        $distances[$source] = 0.0;

        while (! empty($unvisited)) {
            $currentNode = $this->getNearestUnvisitedNode($distances, $unvisited);

            if ($currentNode === null || $distances[$currentNode] === INF) {
                break;
            }

            if ($currentNode === $target) {
                break;
            }

            unset($unvisited[$currentNode]);

            foreach ($graph[$currentNode] as $neighbor => $weight) {
                if (! isset($unvisited[$neighbor])) {
                    continue;
                }

                $candidateDistance = $distances[$currentNode] + (float) $weight;

                if ($candidateDistance < $distances[$neighbor]) {
                    $distances[$neighbor] = $candidateDistance;
                    $previous[$neighbor] = $currentNode;
                }
            }
        }

        $path = $this->buildPath($previous, $source, $target);

        return [
            'distance' => $distances[$target] ?? INF,
            'path' => $path,
        ];
    }

    /**
     * @param  array<string|int, float>  $distances
     * @param  array<string|int, bool>  $unvisited
     */
    protected function getNearestUnvisitedNode(array $distances, array $unvisited): string|int|null
    {
        $nearestNode = null;
        $nearestDistance = INF;

        foreach ($unvisited as $node => $isUnvisited) {
            if (! $isUnvisited) {
                continue;
            }

            if ($distances[$node] < $nearestDistance) {
                $nearestDistance = $distances[$node];
                $nearestNode = $node;
            }
        }

        return $nearestNode;
    }

    /**
     * @param  array<string|int, string|int|null>  $previous
     * @return array<int, string|int>
     */
    protected function buildPath(array $previous, string|int $source, string|int $target): array
    {
        if (! array_key_exists($target, $previous)) {
            return [];
        }

        $path = [];
        $cursor = $target;

        while ($cursor !== null) {
            array_unshift($path, $cursor);

            if ($cursor === $source) {
                break;
            }

            $cursor = $previous[$cursor] ?? null;
        }

        if (($path[0] ?? null) !== $source) {
            return [];
        }

        return $path;
    }
}