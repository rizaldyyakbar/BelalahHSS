# API Documentation

## Base URL

```text
http://127.0.0.1:8000/api
```

## Recommendations

### GET /recommendations

Mengembalikan daftar destinasi yang sudah diurutkan berdasarkan skor SAW atau jarak.

#### Query Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| lat | numeric | Yes | Latitude pengguna |
| lng | numeric | Yes | Longitude pengguna |
| limit | integer | No | Batas hasil, default 10, maksimal 100 |
| sort | string | No | `score` atau `distance` |
| pretty | any | No | Jika diisi, response JSON dibuat rapi |

#### Example Request

```bash
curl "http://127.0.0.1:8000/api/recommendations?lat=-6.2&lng=106.8&limit=5&sort=distance&pretty=1"
```

#### Example Response

```json
[
  {
    "id": 2,
    "name": "Museum Sejarah",
    "image": "http://127.0.0.1:8000/storage/destinations/thumbs/example.jpg",
    "distance_km": 12.34,
    "score": 0.95
  }
]
```

## Image Handling

- `image_url` adalah path gambar asli.
- `image_thumb_url` adalah path thumbnail.
- API akan memakai thumbnail dulu, lalu fallback ke gambar asli.
