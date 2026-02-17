# Sitterly

## Описание

Sitterly — это сервис для поиска и подбора нянь (ситтеров), реализованный с использованием REST API и gRPC.
Он включает регистрацию и аутентификацию пользователей (родителей и ситтеров), создание профилей, размещение
заказов на поиск няни, отклики ситтеров на заказы, сбор отзывов и отображение рейтинга пользователей.

## Стек технологий

- NestJS,
- TypeScript,
- PostgreSQL,
- TypeORM,
- Docker.

## Особенности реализации

Sitterly архитектурно разделён на четыре микросервиса и gateway.
Коммуникация между клиентом и системой осуществляется через REST, а внутренние вызовы - через gRPC.

Ключевые компоненты:

- **Клиентское приложение**: Отправляет HTTP/REST-запросы к gateway и получает данные в формате JSON.
- **Gateway**: Принимает запросы, проверяет аутентификацию (JWT), преобразует входящие HTTP-запросы в gRPC-вызовы к
  внутренним сервисам, агрегирует ответы нескольких сервисов, формирует итоговый REST-ответ.
- **ratingApp**: Работа с оценками и отзывами: предоставляет методы для добавления отзыва,
  расчёта и получения агрегированного рейтинга пользователей.
- **orderApp**: Реализует бизнес-логику заказов и заявок. Обеспечивает оформление заказа родителя и отклик
  ситтера на заказ.
- **profileApp**: Работа с профилями ситтеров и родителей: предоставляет методы для создания/обновления профиля,
  а также маршруты для получения списка или конкретных профилей.
- **authUserApp**: Осуществляет регистрацию и аутентификацию пользователей, генерацию и валидацию JWT-токенов.

Сервис предоставляет возможность регистрации и авторизации пользователей через соответствующие страницы
/authorize и /register. При успешной авторизации пользователю предоставляется JWT токен для доступа к запросам gateway.

## Установка и запуск проекта

### Требования

- NestJS
- PostgreSQL
- Docker

### Установка зависимостей

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/Flyseee/sitterly
   cd sitterly
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Создайте файл .env в папке config каждого микросервиса проекта и скопируйте значения из .env.example.

### Запуск приложения

Для запуска приложения используйте:

   ```bash
   docker-compose up --build
   ```

## Диаграмма размещения

![Диаграмма размещения Sitterly](/README-img/placement-diagram.png)

## Cвязи в базах данных микросервисов

### Диаграмма связей базы данных ratingApp

![Диаграмма связей ratingApp](/README-img/ratingApp-relationship-diagram.png)

### Диаграмма связей базы данных profileApp

![Диаграмма связей profileApp](/README-img/profileApp-relationship-diagram.png)

### Диаграмма связей базы данных orderApp

![Диаграмма связей orderApp](/README-img/orderApp-relationship-diagram.png)

### Диаграмма связей базы данных authUserApp

![Диаграмма связей authUserApp](/README-img/authUserApp-relationship-diagram.png)

## API

Все ответы API возвращают значения в поле data, если запрос прошел успешно, или возвращают ошибки
выполнения запроса в поле _error.

### Эндпоинты для взаимодействия с клиентом

#### Gateway (HTTP)

- **Получить информацию о пользователе и его профиле**
    - URL: /v1/gateway/userInfo
    - Метод: POST
    - Заголовок:
        - Authorization: Bearer your_access_token
    - Тело запроса:
      ```json
        {
          "profileType": "PARENT"
        }
      ```
    - Ответ запроса:
        - Код: 200
        - Тело ответа:
          ```json
            {
              "user": {
                "id": 4,
                "phoneNumber": "+71111111111",
                "password": "a1f9867faddf49daa0192d4c2e6df9:21d94adf1026f2f72",
                "sitterProfileId": 3,
                "parentProfileId": 3,
                "firstName": "Лидия",
                "lastName": "Петрова",
                "secondName": "Александровна",
                "birthDate": "Sat Nov 25 1950 00:00:00 GMT+0000"
              },
              "profile": {
                "id": 3,
                "ordersAmount": 2
              },
              "rating": {
                "profileId": 4,
                "profileType": 0,
                "rating": 4,
                "reviewsAmount": 2
              },
              "reviews": [
                {
                  "id": 5,
                  "profileFromId": 1,
                  "profileToId": 4,
                  ...
                }, ...
              ]
            }
          ```

- **Получить все актуальные заказы**
    - URL: /v1/gateway/getActualOrders
    - Метод: GET
    - Заголовок:
        - Authorization: Bearer your_access_token
    - Ответ запроса:
        - Код: 200
        - Тело ответа:
          ```json
            {
              "data": [
                {
                  "id": 1,
                  "parentId": 1,
                  "description": "Вечерний присмотр за детьми",
                  "location": "Санкт-Петербург, Невский район",
                  "durationHours": 3,
                  "durationMinutes": 30,
                  "cost": 2500,
                  "kidsDescription": "Двое детей: 5 и 8 лет, активные, интересуются рисованием",
                  "date": "Mon Jun 02 2025 15:00:00 GMT+0000",
                  "parentName": "Покрова Ангелина"
                },
                {
                  "id": 2,
                  "parentId": 2,
                  "sitterId": 2,
                  "description": "Посидеть с ребенком",
                  "location": "Санкт-Петербург, Невский район",
                  "durationHours": 3,
                  "durationMinutes": 30,
                  "cost": 2500,
                  "kidsDescription": "Один ребенок, 10 лет",
                  "date": "Mon Jun 02 2025 15:00:00 GMT+0000",
                  "parentName": "Петров Петр"
                }
              ]
            }
          ```

- **Создать профиль родителя**
    - URL: /v1/gateway/createParent
    - Метод: POST
    - Заголовок:
        - Authorization: Bearer your_access_token
    - Тело запроса:
      ```json
        {
          "ordersAmount": 0
        }
      ```
    - Ответ:
        - Код: 201
        - Тело ответа:
          ```json
            {
              "data": {
                "id": 10,
                "ordersAmount": 0
              }
            }
          ```

- **Создать профиль ситтера**
    - URL: /v1/gateway/createSitter
    - Метод: POST
    - Заголовок:
        - Authorization: Bearer your_access_token
    - Тело запроса:
      ```json
        {
          "ordersAmount": 0,
          "price": 0,
          "location": "Санкт-Петербург, м. Парк Победы"
        }
      ```
    - Ответ:
        - Код: 201
        - Тело ответа:
          ```json
            {
            "data": {
              "id": 12,
              "ordersAmount": 0,
              "price": 0,
              "location": "Санкт-Петербург, м. Парк Победы"
            }
          }
          ```

### Эндпоинты для взаимодействия Gateway с микросервисами

#### UserInfo (gRPC)

- **Получить информацию о пользователе по ID**
    - URL: UserInfoRpcService/GetUserById
    - Тело запроса:
      ```json
        {
          "id": 1
        }
      ```
    - Ответ:
      ```json
        {
          "data": {
            "id": 1,
            "phone_number": "+70000000000",
            "password": "2aafae886ebf512121ad2de733f67295:b3e8063e4dd4bbf396b3cc846d439",
            "sitterProfileId": 0,
            "parentProfileId": 0,
            "first_name": "Виктор",
            "last_name": "Васильев",
            "second_name": "Васильевич",
            "birthDate": "Mon May 19 2025 00:00:00 GMT+0000 (Coordinated Universal Time)",
            "email": "admin@gmail.com"
          }
        }
      ```

- **Обновить пользователя**
    - URL: UserInfoRpcService/UpdateUser
    - Тело запроса:
      ```json
        {
          "id": 3,
          "email": "new@ya.ru",
          "last_name": "Петров"
        }
      ```
    - Ответ:
      ```json
        {
          "data": {
            "id": 3,
            "phone_number": "",
            "password": "",
            "sitterProfileId": 0,
            "parentProfileId": 0,
            "first_name": "",
            "last_name": "Петров",
            "second_name": "",
            "birthDate": "",
            "email": "new@ya.ru"
          }
        }
      ```

- **Получить информацию о пользователе по его профилю**
    - URL: UserInfoRpcService/GetByProfile
    - Тело запроса:
      ```json
        {
          "profileId": 4,
          "profileType": "SITTER"
        }
      ```
    - Ответ:
      ```json
        {
          "data": {
            "id": 5,
            "phone_number": "+72222222222",
            "password": "aa947f0f1036acaca5c3174d7ee5dda2:907e76d17957f322809dcd6068beff95",
            "sitterProfileId": 4,
            "parentProfileId": 4,
            "first_name": "Жанна",
            "last_name": "Смирнова",
            "second_name": "Викторовна",
            "birthDate": "Wed Dec 20 2000 00:00:00 GMT+0000 (Coordinated Universal Time)",
            "email": "..."
          }
        }
      ```

#### OrderApplication (gRPC)

- **Оформить заказ**
    - URL: OrderApplicationRpcService/applyOrder
    - Тело запроса:
      ```json
        {
          "orderId": 3,
          "sitterId": 2
        }
      ```
    - Ответ:
      ```json
        {
          "data": {
          "id": 4,
          "orderId": 3,
          "sitterId": 2
        }
      }
      ```

- **Получить заявки на заказ**
    - URL: OrderApplicationRpcService/getApplicationsForOrder
    - Тело запроса:
      ```json
        {
          "orderId": 3
        }
      ```
    - Ответ:
      ```json
        {
          "data": [
            {
              "id": 4,
              "orderId": 3,
              "sitterId": 2
            }
          ]
        }
      ```

- **Отменить заявку на заказ**
    - URL: OrderApplicationRpcService/cancelOrderApplication
    - Тело запроса:
      ```json
        {
          "id": 4
        }
      ```
    - Ответ:
      ```json
        {
          "data": {}
        }
      ```

#### FuncOrder (gRPC)

- **Получить актуальные заказы**
    - URL: FuncOrderRpcService/getActualOrders
    - Ответ:
      ```json
        {
        "data": [
          {
            "id": 1,
            "parentId": 1,
            "sitterId": 0,
            "description": "Вечерний присмотр за детьми",
            "location": "Санкт-Петербург, Невский район",
            "durationHours": 3,
            "durationMinutes": 30,
            "cost": 2500,
            "kidsDescription": "Двоe детей: 5 и 8 лет, активные, интересуются рисованием",
            "date": "Mon Jun 02 2025 15:00:00 GMT0000 (Coordinated Universal Time)"
          },
          {
            "id": 2,
            "parentId": 2,
            "sitterId": 2,
            "description": "Посидеть с ребенком",
            "location": "Санкт-Петербург, Невский район",
            "durationHours": 3,
            "durationMinutes": 30,
            "cost": 2500,
            "kidsDescription": "Один ребенок, 10 лет",
            "date": "Mon Jun 02 2025 15:00:00 GMT+0000",
            "parentName": "Петров Петр"
          }
        ]
      }
      ```

- **Создать заказ**
    - URL: FuncOrderRpcService/createOrder
    - Тело запроса:
      ```json
        {
          "parentId": 2,
          "sitterId": 1,
          "description": "Вечерний присмотр за детьми",
          "location": "Санкт-Петербург, Невский район",
          "durationHours": 3,
          "durationMinutes": 30,
          "cost": 2500,
          "kidsDescription": "Две дети: 5 и 8 лет, активные, интересуются рисованием",
          "date": "2025-09-02T18:00:00+03:00"
        }
      ```
    - Ответ:
      ```json
        {
          "data": {
            "id": 4,
            "parentId": 2,
            "sitterId": 1,
            "description": "Вечерний присмотр за детьми"
            "location": "Санкт-Петербург, Невский район",
            "durationHours": 3,
            "durationMinutes": 30,
            "cost": 2500,
            "kidsDescription": "Две дети: 5 и 8 лет, активные, интересуются рисованием",
            "date": "2025-09-02T18:00:00+03:00"
          }
        }
      ```

- **Обновить заказ**
    - URL: FuncOrderRpcService/updateOrder
    - Тело запроса:
      ```json
        {
          "id": 4,
          "cost": 5000
        }
      ```
        - Ответ:
      ```json
        {
          "data": {
            "id": 4,
            "cost": 5000
          }
        }
      ```

#### ProfileRewievs (gRPC)

- **Создать отзыв**
    - URL: ProfileReviewsRpcService/put
    - Тело запроса:
      ```json
      {
        "profileFromId": 3,
        "profileToId": 1,
        "profileToType": "SITTER",
        "text": "Отличный ситтер!",
        "stars": 4
      }
      ```
    - Ответ:
      ```json
      {
        "data": {
          "id": 40,
          "profileFromId": 3,
          "profileToId": 1,
          "profileToType": "SITTER",
          "text": "Отличный ситтер!",
          "stars": 4,
          "date": "2025-05-29",
          "isConsidered": false
        }
      }
      ```

- **Получить список отзывов для профиля**
    - URL: ProfileReviewsRpcService/getListForProfile
    - Тело запроса:
      ```json
      {
        "profileToId": 4,
        "profileToType": "PARENT"
      }
      ```
    - Ответ:
      ```json
      {
        "data": [
          {
            "id": 5,
            "profileFromId": 1,
            "profileToId": 4,
            "profileToType": "PARENT",
            "text": "okay",
            "stars": 5,
            "date": "2025-05-26",
            "isConsidered": false
          }
        ]
      }
      ```

#### UserRating (gRPC)

- **Получить рейтинг пользователя**
    - URL: UserRatingRpcService/get
    - Тело запроса:
      ```json
      {
        "profileId": 1,
        "profileType": "PARENT"
      }
      ```
    - Ответ:
      ```json
      {
        "data": {
          "profileId": 1,
          "profileType": "PARENT",
          "rating": 4,
          "reviewsAmount": 1
        }
      }
      ```

#### FuncSitterProfile (gRPC)

- **Получить профиль ситтера**
    - URL: FuncSitterProfileRpcService/get
    - Тело запроса:
      ```json
        {
          "id": 1
        }
      ```
    - Ответ:
      ```json
        {
        "data": {
          "id": 1,
          "ordersAmount": 1,
          "price": 500,
          "location": "Санкт-Петербург"
        }
      }
      ```

- **Создать профиль ситтера**
    - URL: FuncSitterProfileRpcService/put
    - Тело запроса:
      ```json
        {
          "location": "Санкт-Петербург, центральный район",
          "ordersAmount": 2,
          "price": 5000
        }
      ```
    - Ответ:
      ```json
        {
          "data": {
            "id": 10,
            "ordersAmount": 2,
            "price": 5000,
            "location": "Санкт-Петербург, центральный район"
          }
        }
      ```

- **Обновить профиль ситтера**
    - URL: FuncSitterProfileRpcService/update
    - Тело запроса:
      ```json
        {
          "id": 2,
          "price": 300
        }
      ```
    - Ответ:
      ```json
      {
        "data": {
          "id": 2,
          "price": 300
        }
      }
      ```

#### FuncParentProfile (gRPC)

- **Получить профиль родителя**
    - URL: FuncParentProfileRpcService/get
    - Тело запроса:
      ```json
        {
          "id": 2
        }
      ```
    - Ответ:
      ```json
        {
          "data": {
            "id": 2,
            "ordersAmount": 5
          }
        }
      ```

- **Создать профиль родителя**
    - URL: FuncParentProfileRpcService/put
    - Тело запроса:
      ```json
        {
          "ordersAmount": 3
        }
      ```
    - Ответ:
      ```json
        {
          "data": {
            "id": 9,
            "ordersAmount": 3
          }
        }
      ```


- **Обновить профиль родителя**
    - URL: FuncParentProfileRpcService/update
    - Тело запроса:
      ```json
        {
          "id": 2,
          "ordersAmount": 4
        }
      ```
    - Ответ:
      ```json
        {
          "data": {
            "id": 2,
            "ordersAmount": 4
          }
        }
      ```
      
