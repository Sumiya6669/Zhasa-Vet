{
  "name": "BlogPost",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Blog post title"
    },
    "slug": {
      "type": "string",
      "description": "URL slug"
    },
    "excerpt": {
      "type": "string",
      "description": "Short excerpt"
    },
    "content": {
      "type": "string",
      "description": "Full HTML content"
    },
    "image_url": {
      "type": "string",
      "description": "Cover image URL"
    },
    "author": {
      "type": "string",
      "description": "Author name"
    },
    "published": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "title",
    "content"
  ]
}