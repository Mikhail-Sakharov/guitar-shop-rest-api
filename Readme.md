# Личный проект «Шесть городов (простой)»

* Студент: [Михаил Сахаров](https://up.htmlacademy.ru/nodejs-api/2/user/1965263).
* Наставник: `Дмитрий (sench) Железцов`.

---

_Не удаляйте и не изменяйте папки и файлы:_
_`.editorconfig`, `.gitattributes`, `.gitignore`._

---

## Памятка

### 1. Зарегистрируйтесь на Гитхабе

Если у вас ещё нет аккаунта на [github.com](https://github.com/join), скорее зарегистрируйтесь.

### 2. Создайте форк

Откройте репозиторий и нажмите кнопку «Fork» в правом верхнем углу. Репозиторий из Академии будет скопирован в ваш аккаунт.

<img width="769" alt="Press 'Fork'" src="https://cloud.githubusercontent.com/assets/259739/20264045/a1ddbf40-aa7a-11e6-9a1a-724a1c0123c8.png">

Получится вот так:

<img width="769" alt="Forked" src="https://cloud.githubusercontent.com/assets/259739/20264122/f63219a6-aa7a-11e6-945a-89818fc7c014.png">

### 3. Клонируйте репозиторий на свой компьютер

Будьте внимательны: нужно клонировать свой репозиторий (форк), а не репозиторий Академии. Также обратите внимание, что клонировать репозиторий нужно через SSH, а не через HTTPS. Нажмите зелёную кнопку в правой части экрана, чтобы скопировать SSH-адрес вашего репозитория:

<img width="769" alt="SSH" src="https://cloud.githubusercontent.com/assets/259739/20264180/42704126-aa7b-11e6-9ab4-73372b812a53.png">

Клонировать репозиторий можно так:

```
git clone SSH-адрес_вашего_форка
```

Команда клонирует репозиторий на ваш компьютер и подготовит всё необходимое для старта работы.

### 4. Начинайте обучение!

---

<a href="https://htmlacademy.ru/profession/fullstack"><img align="left" width="50" height="50" title="HTML Academy" src="https://up.htmlacademy.ru/static/img/intensive/nodejs/logo-for-github-2.png"></a>

Репозиторий создан для обучения на профессиональном онлайн‑курсе «[Node.js. Профессиональная разработка REST API](https://htmlacademy.ru/profession/fullstack)» от [HTML Academy](https://htmlacademy.ru).


## Запуск проекта (руководство пользователя)

### Настройки

Для описания настроек приложения используются переменные окружения (в файле с расширением .env в корне проекта).
Схема настройки описана в файле config.schema.ts.

Перечень переменных окружения доступных для настройки:
<PORT> - порт запуска приложения
<SALT> - токен(соль) для хеширования пароля пользователя
<DB_HOST> - хост запуска базы данных (БД)
<DB_USER> - имя пользователя для подключения к БД
<DB_PASSWORD> - пароль для подключения к БД
<DB_PORT> - порт для подключения к БД
<DB_NAME> - имя БД
<UPLOAD_DIRECTORY> - директория для хранения файлов пользователей
<JWT_SECRET> - строка для хеширования подписи JWT токена

### 1. Наполнение базы данных тестовыми данными

#### 1.1 Генерация моковых данных

Для запуска сервера тестовых данных в файле package.json добавлен сценарий "mock:server"
По умолчанию сервер запускается на 127.0.0.1 на порту 8888.
Номер порта можно изменить в описании сценария.

##### 1.1.1 Командная строка (CLI)

В приложении реализован модуль для работы череp интерфейс командной строки.

Для генерации тестовых данных необходимо воспользоваться командой:
npm run ts ./src/cli.ts -- --generate <productsCount> <path> <mockServer>

Указанная команда принимает следующие аргументы:
<productsCount> - количество записей, которые необходимо сгенерировать
<path> - путь и название файла, в который необходимо сохранить генерируемые записи (расширение файла *.tsv)
<mockServer> - адрес сервера с тестовыми данными, запускаемый сценарием "mock:server"

Пример использования команды:
npm run ts ./src/cli.ts -- --generate 100 ./src/mocks/test.tsv http://localhost:8888/api

##### 1.1.2 Импорт тестовых данных в БД

Импорт в базу данных (БД) тестовых данных производится командой:
npm run ts ./src/cli.ts -- --import <path> <bd_user> <bd_password> <bd_host> <bd_name> <salt>

Указанная команда принимает следующие аргументы:
<path> - путь и название файла, содеожащего тестовые данные в виде записей для импорта в БД (расширение файла *.tsv)
<bd_user> - имя пользователя БД
<bd_password> - пароль для подключения к БД
<bd_host> - адрес для подключения к БД
<bd_name> - имя БД
<salt> - соль для хеширования пароля

Пример использования команды:
npm run ts ./src/cli.ts -- --import ./src/mocks/test.tsv admin test 127.0.0.1 six-cities-simple qweasdzxc

### 2. Запуск приложения

#### 2.1 Сценарии запуска

Предусмотрено два сценария для запуска приложения:
"start" - продуктовый режим
"start:dev" - режим разработки

Другие сценарии:
"build" - очистка/создание директории для компиляции и сборки проекта (включает сценарии "compile" и "clean")
"lint" - проверка кода на наличие ошибок (настройки указаны в описании сценария)
"compile" - скомпилировать проект
"clean" - очистка директории, в которую собирается проект
"ts" - запуск TypeScript сценариев
"mock:server" - запуск сервера с тестовыми данными

По умолчанию сервер запускается на 127.0.0.1 на порту 3300.
Настройки запуска задаются переменными окружения в файле с расширением .env

#### 2.2 Список ресурсов

После запуска приложения клиентам доступны следующие ресурсы:
 - Создание нового предложения
 - Редактирование предложения
 - Удаление предложения по аренде
 - Список предложений по аренде
 - Детальная информация по предложению
 - Список комментариев для предложения
 - Добавление комментария
 - Создание нового пользователя
 - Вход в закрытую часть приложения
 - Проверка состояния пользователя

Подробное описание API приведено в файле /specification/project.spec.yml в формате OpenAPI.

### 3. Тестирование работы сервисов

Для удобства тестирования работы сервисов в корне проекта добавлен файл queries.http
Тестирование осуществляется путём отправления HTTP-запросов ресурсам, перечисленным в п. 2.2 настоящего руководства
  и описанным в файле /specification/project.spec.yml
Для выполнения запросов необходимо установить расширение REST Client (для редактора VS Code), либо аналогичное для вашего редактора.
