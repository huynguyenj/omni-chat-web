const data = [
{
      "code": 0,
      "message": "success",
      "orderItems": [
            {
                  "id": 1,
                  "quantity": 2,
            },
            {
                  "id": 2,
                  "quantity": 3,
            }
      ]
},
{
      "code": 0,
      "message": "success",
      "orderItems": [
            {
                  "id": 3,
                  "quantity": 1,
            },
            {
                  "id": 4,
                  "quantity": 4,
            }
      ]
}
]

const result = []
data.forEach(item => {
    item.orderItems.forEach(orderItem => {
        result.push(orderItem)
    })
})
console.log(result)