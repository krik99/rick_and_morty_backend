## About
This is a basic CRUD API on Express.js + Mongodb for articles app. Created to be able to develop a front-end service for articles about Rick and Morty.
Features:
Store characters articles

## Installation
All what you need to install the **Docker**

## Runing
Go in root project directory and execute in terminal:
```bash
docker-compose build
docker-compose up
```

## Routes
Place static files in **/static** dir to share in articles in path /storage/img/<img.png>

Characters API
Method | Request | Description
--- | --- | ---
**GET** | **/v1/characters** | get all characters sorted by published date (by default characters list is limited to 10 items)
**GET** | **/v1/characters?page=2&limit=20** | get all characters sorted by published date (on page 2 with 20 items limit)
**GET** | **/v1/characters/<character_id>** | get the single character with <character_id>
**GET** | **/v1/characters?id=<article_id1>,<article_id2>,...** | get characters with specified ids
**POST** | **/v1/characters** | publish new character. Character object transmiting in body request
**PUT** | **/v1/characters/<character_id>** | edit the single character with <character_id>. Character object transmiting in body request
**DELET** | **/v1/characters/<character_id>** | delet the single character with <character_id>

Categories
Method | Request | Description
--- | --- | ---
**GET** | **/v1/characters/categories** | get all possible character categories

Comments
Method | Request | Description
--- | --- | ---
**POST** | **/v1/characters/<character_id>/comments** | publish comment to specified character. Comment message transmiting in body reauest {"message":"Some comment..."}
**DELETE** | **/v1/characters/<character_id>/comments/<comment_id>** | delete comment from character with specified id