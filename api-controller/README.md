# API Controller

## API Specification
API : `/api/v1/upload/template`
Method : `POST`
Error Codes: `200`, `400`, `405`

## Python Version : Python >=3.6
For Windows:
[Link to download](https://www.python.org/downloads/)

For Linux:
```
sudo apt-get install python3
```

## Pip required

## Install Requirements
```
pip3 install -r requirements.txt
```

## Run Backend Server
```
python3 app.py
```

## Testing Backend
Install Postman and Import this collection`JLTIndaChallenge.postman_collection.json`. Run the `Upload Template and ClientJson` Test and check if you get `200OK`.

## Reference in the Front End
```
<form method="post" action="/api/v1/upload/template" enctype="multipart/form-data">
    <input type="file" name="template" autocomplete="off" required>
    <input type="file" name="clientJson" autocomplete="off" required>
    <input type="submit" value="Submit">
</form>
```