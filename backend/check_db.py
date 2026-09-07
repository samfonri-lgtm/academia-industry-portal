import sqlite3

connection = sqlite3.connect("database/academiaconnect.db")
connection.row_factory = sqlite3.Row

cursor = connection.cursor()

tables = cursor.execute("""
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
""").fetchall()

for table in tables:
    table_name = table["name"]

    print("\n==============================")
    print("TABLE:", table_name)
    print("==============================")

    columns = cursor.execute(
        f'PRAGMA table_info("{table_name}")'
    ).fetchall()

    for column in columns:
        print(dict(column))

connection.close()
