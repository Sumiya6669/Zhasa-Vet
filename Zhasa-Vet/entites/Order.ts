{
  "name": "Order",
  "type": "object",
  "properties": {
    "customer_name": {
      "type": "string"
    },
    "customer_phone": {
      "type": "string"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "product_id": {
            "type": "string"
          },
          "product_name": {
            "type": "string"
          },
          "article": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "price": {
            "type": "number"
          }
        }
      }
    },
    "total": {
      "type": "number"
    },
    "payment_method": {
      "type": "string",
      "enum": [
        "cash",
        "whatsapp"
      ],
      "default": "cash"
    },
    "status": {
      "type": "string",
      "enum": [
        "new",
        "confirmed",
        "ready",
        "completed",
        "cancelled"
      ],
      "default": "new"
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "customer_name",
    "customer_phone",
    "items",
    "total"
  ]
}