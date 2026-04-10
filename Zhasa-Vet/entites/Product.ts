{
  "name": "Product",
  "type": "object",
  "properties": {
    "article": {
      "type": "string",
      "description": "Article number in ZV-XXX format"
    },
    "name": {
      "type": "string",
      "description": "Product name"
    },
    "description": {
      "type": "string",
      "description": "Short product description"
    },
    "price": {
      "type": "number",
      "description": "Price in tenge"
    },
    "category": {
      "type": "string",
      "enum": [
        "\u041a\u043e\u0440\u043c\u0430 \u0438 \u043f\u0438\u0442\u0430\u043d\u0438\u0435",
        "\u041b\u0435\u043a\u0430\u0440\u0441\u0442\u0432\u0430 \u0438 \u0444\u0430\u0440\u043c\u0430\u0446\u0435\u0432\u0442\u0438\u043a\u0430",
        "\u0412\u0438\u0442\u0430\u043c\u0438\u043d\u044b \u0438 \u0434\u043e\u0431\u0430\u0432\u043a\u0438",
        "\u0410\u043d\u0442\u0438\u043f\u0430\u0440\u0430\u0437\u0438\u0442\u0430\u0440\u043d\u044b\u0435 \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0430",
        "\u0413\u0438\u0433\u0438\u0435\u043d\u0430 \u0438 \u0443\u0445\u043e\u0434",
        "\u0410\u043a\u0441\u0435\u0441\u0441\u0443\u0430\u0440\u044b \u0438 \u043e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u0438\u0435",
        "\u0423\u0445\u043e\u0434 \u0437\u0430 \u0440\u0430\u043d\u0430\u043c\u0438",
        "\u041b\u0430\u043a\u043e\u043c\u0441\u0442\u0432\u0430"
      ],
      "description": "Product category"
    },
    "animal_types": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "\u041a\u0420\u0421",
          "\u041c\u0420\u0421",
          "\u041b\u043e\u0448\u0430\u0434\u0438",
          "\u0421\u043e\u0431\u0430\u043a\u0438",
          "\u041a\u043e\u0448\u043a\u0438",
          "\u0425\u043e\u043c\u044f\u043a\u0438 \u0438 \u0433\u0440\u044b\u0437\u0443\u043d\u044b",
          "\u041f\u043e\u043f\u0443\u0433\u0430\u0438 \u0438 \u043f\u0442\u0438\u0446\u044b",
          "\u041c\u0435\u043b\u043a\u0438\u0435 \u043f\u0438\u0442\u043e\u043c\u0446\u044b"
        ]
      },
      "description": "Animal types this product is for"
    },
    "brand": {
      "type": "string",
      "description": "Brand name"
    },
    "image_url": {
      "type": "string",
      "description": "Product image URL"
    },
    "rating": {
      "type": "number",
      "description": "Average rating 1-5"
    },
    "reviews_count": {
      "type": "number",
      "description": "Number of reviews"
    }
  },
  "required": [
    "article",
    "name",
    "price",
    "category"
  ]
}