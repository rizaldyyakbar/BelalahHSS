<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;

class ProcessModelImageThumbnail implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $modelClass,
        public int $modelId,
        public string $sourceAttribute = 'image_url',
        public string $thumbAttribute = 'image_thumb_url',
        public string $disk = 'public',
    ) {}

    public function handle(): void
    {
        if (! is_subclass_of($this->modelClass, Model::class)) {
            return;
        }

        /** @var Model|null $model */
        $model = $this->modelClass::query()->find($this->modelId);

        if (! $model) {
            return;
        }

        $sourcePath = $model->{$this->sourceAttribute};

        if (! is_string($sourcePath) || $sourcePath === '') {
            $model->forceFill([$this->thumbAttribute => null])->saveQuietly();

            return;
        }

        $storage = Storage::disk($this->disk);

        if (! $storage->exists($sourcePath)) {
            return;
        }

        $thumbPath = $this->makeThumbPath($sourcePath);
        $storage->makeDirectory(dirname($thumbPath));

        $sourceFullPath = $storage->path($sourcePath);
        $thumbFullPath = $storage->path($thumbPath);

        $driverClass = $this->resolveImageDriver();

        if ($driverClass) {
            ImageManager::usingDriver($driverClass)
                ->decodePath($sourceFullPath)
                ->scaleDown(480, 480)
                ->save($thumbFullPath);
        } else {
            // Fallback: keep the pipeline working even when no image extension is enabled.
            $storage->copy($sourcePath, $thumbPath);
        }

        $model->forceFill([$this->thumbAttribute => $thumbPath])->saveQuietly();
    }

    protected function makeThumbPath(string $sourcePath): string
    {
        $directory = trim(dirname($sourcePath), '.\\/');
        $basename = basename($sourcePath);

        if ($directory === '') {
            return 'thumbs/' . $basename;
        }

        return $directory . '/thumbs/' . $basename;
    }

    protected function resolveImageDriver(): ?string
    {
        if (extension_loaded('gd')) {
            return GdDriver::class;
        }

        if (extension_loaded('imagick')) {
            return ImagickDriver::class;
        }

        return null;
    }
}