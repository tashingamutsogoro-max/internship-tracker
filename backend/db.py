import pymysql
from config import Config

def get_connection():
    return pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        port=int(Config.DB_PORT),
        cursorclass=pymysql.cursors.DictCursor,
        ssl={'ssl': True}
    )
