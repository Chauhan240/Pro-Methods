import sqlite3
import os

DB_PATH = 'backend/pro_methods.db'

def migrate_db():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    columns_to_add = [
        ("first_name", "VARCHAR"),
        ("last_name", "VARCHAR"),
        ("date_of_birth", "DATE"),
        ("gender", "VARCHAR")
    ]

    try:
        # Get existing columns
        cursor.execute("PRAGMA table_info(users)")
        existing_columns = [info[1] for info in cursor.fetchall()]

        for col_name, col_type in columns_to_add:
            if col_name not in existing_columns:
                print(f"Adding column {col_name}...")
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
            else:
                print(f"Column {col_name} already exists.")

        conn.commit()
        print("Migration completed successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_db()
